/**
 * SmartLibrary - State Store
 * Centralized application state.
 * Hydrated from the Express.js / MongoDB backend.
 */

import { api } from './api.js';

const SESSION_KEY = 'smartlibrary_session_v1';
const WISHLIST_KEY = 'smartlibrary_wishlist_v1';

const state = {
  books: [],
  members: [],
  borrowings: [],
  reservations: [],
  fines: [],
  notifications: [],
  wishlist: (() => {
    try {
      const w = localStorage.getItem(WISHLIST_KEY);
      return w ? JSON.parse(w) : [];
    } catch {
      return [];
    }
  })()
};

function saveWishlist() {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.wishlist));
  } catch {}
}

function syncMemberCounts(targetState) {
  if (!targetState.members || !targetState.borrowings) return;
  targetState.members.forEach(member => {
    member.booksBorrowed = targetState.borrowings.filter(
      b => (b.memberId === member.id || b.memberId === member._id) && (b.status === 'borrowed' || b.status === 'overdue')
    ).length;
  });
}

export const store = {
  getState() {
    return state;
  },

  async initFromBackend() {
    const session = this.getSession();
    if (!session || !session.token) return;

    try {
      // 1. Fetch books
      const books = await api.getBooks().catch(() => []);
      state.books = books || [];

      // 2. Fetch members (librarians get full member list, students get their own profile)
      if (session.role === 'librarian' || session.role === 'admin') {
        const members = await api.getMembers().catch(() => []);
        state.members = members || [];
      } else {
        const me = await api.getMe().catch(() => session);
        state.members = [me || session];
      }

      // 3. Fetch borrowings
      const borrowings = await api.getBorrowings().catch(() => []);
      state.borrowings = borrowings || [];

      // 4. Fetch reservations
      const reservations = await api.getReservations().catch(() => []);
      state.reservations = reservations || [];

      // 5. Fetch fines
      const fines = await api.getFines().catch(() => []);
      state.fines = fines || [];

      // 6. Fetch notifications
      const notifications = await api.getNotifications().catch(() => []);
      state.notifications = notifications || [];

      syncMemberCounts(state);
      console.log('[SmartLibrary] Store hydrated from backend successfully.');
    } catch (err) {
      console.warn('[SmartLibrary] Could not fully hydrate store from backend:', err);
    }
  },

  // --- Books ---
  getBooks() {
    return state.books;
  },

  getBook(id) {
    return state.books.find(b => b.id === id || b._id === id);
  },

  async addBook(book) {
    try {
      const created = await api.addBook(book);
      state.books.push(created);
      return created;
    } catch (err) {
      // Local fallback
      book.id = book.id || 'b' + Date.now();
      state.books.push(book);
      return book;
    }
  },

  async updateBook(id, updates) {
    const book = this.getBook(id);
    if (book) {
      Object.assign(book, updates);
    }
    try {
      await api.updateBook(id, updates);
    } catch (err) {
      console.warn('API updateBook failed:', err.message);
    }
    return book;
  },

  async deleteBook(id) {
    const idx = state.books.findIndex(b => b.id === id || b._id === id);
    if (idx >= 0) {
      state.books.splice(idx, 1);
    }
    try {
      await api.deleteBook(id);
    } catch (err) {
      console.warn('API deleteBook failed:', err.message);
    }
  },

  // --- Members ---
  getMembers() {
    return state.members;
  },

  getMember(id) {
    const member = state.members.find(m => m.id === id || m._id === id);
    if (member) return member;

    // Fallback to active session if matching
    const session = this.getSession();
    if (session && (session.id === id || session._id === id)) {
      return {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
        membershipId: session.membershipId || '',
        status: 'active',
        booksBorrowed: state.borrowings.filter(
          b => (b.memberId === id || b.memberId === session.id) && (b.status === 'borrowed' || b.status === 'overdue')
        ).length,
        outstandingFine: 0
      };
    }
    return null;
  },

  getMemberByEmail(email) {
    return state.members.find(m => m.email === email);
  },

  async addMember(member) {
    try {
      const created = await api.addMember(member);
      state.members.push(created);
      return created;
    } catch (err) {
      member.id = member.id || 'm' + Date.now();
      state.members.push(member);
      return member;
    }
  },

  async updateMember(id, updates) {
    const member = this.getMember(id);
    if (member) {
      Object.assign(member, updates);
    }
    try {
      await api.updateMember(id, updates);
    } catch (err) {
      console.warn('API updateMember failed:', err.message);
    }
    return member;
  },

  // --- Borrowings ---
  getBorrowings() {
    return state.borrowings;
  },

  getBorrowingsByMember(memberId) {
    return state.borrowings.filter(b => b.memberId === memberId);
  },

  getActiveBorrowings() {
    return state.borrowings.filter(b => b.status === 'borrowed' || b.status === 'overdue');
  },

  async addBorrowing(bookId, memberId) {
    try {
      const record = await api.borrowBook(bookId, memberId);
      state.borrowings.push(record);
      const book = this.getBook(bookId);
      if (book && book.availableCopies > 0) book.availableCopies--;
      this.updateMemberBorrowCount(memberId);
      return record;
    } catch (err) {
      const book = this.getBook(bookId);
      if (!book || book.availableCopies <= 0) return null;
      const today = new Date();
      const due = new Date(today);
      due.setDate(due.getDate() + 14);
      const borrowing = {
        id: 'br' + Date.now(),
        bookId,
        memberId,
        issueDate: today.toISOString().split('T')[0],
        dueDate: due.toISOString().split('T')[0],
        returnDate: null,
        status: 'borrowed',
        fine: 0
      };
      state.borrowings.push(borrowing);
      book.availableCopies--;
      this.updateMemberBorrowCount(memberId);
      return borrowing;
    }
  },

  async returnBook(borrowingId) {
    const borrowing = state.borrowings.find(b => b.id === borrowingId || b._id === borrowingId);
    if (!borrowing || borrowing.status === 'returned') return null;

    try {
      const res = await api.returnBook(borrowingId);
      borrowing.returnDate = res.returnDate || new Date().toISOString().split('T')[0];
      borrowing.status = 'returned';
      const book = this.getBook(borrowing.bookId);
      if (book) book.availableCopies++;
      this.updateMemberBorrowCount(borrowing.memberId);
      return res;
    } catch (err) {
      borrowing.returnDate = new Date().toISOString().split('T')[0];
      borrowing.status = 'returned';
      const book = this.getBook(borrowing.bookId);
      if (book) book.availableCopies++;
      this.updateMemberBorrowCount(borrowing.memberId);
      return borrowing;
    }
  },

  updateMemberBorrowCount(memberId) {
    const member = this.getMember(memberId);
    if (!member) return;
    member.booksBorrowed = state.borrowings.filter(
      b => (b.memberId === memberId || b.memberId === member._id) && (b.status === 'borrowed' || b.status === 'overdue')
    ).length;
  },

  // --- Reservations ---
  getReservations() {
    return state.reservations;
  },

  getReservationsByMember(memberId) {
    return state.reservations.filter(r => r.memberId === memberId);
  },

  async addReservation(bookId, memberId) {
    try {
      const res = await api.reserveBook(bookId, memberId);
      state.reservations.push(res);
      return res;
    } catch (err) {
      const reservation = {
        id: 'r' + Date.now(),
        bookId,
        memberId,
        reservedOn: new Date().toISOString().split('T')[0],
        status: 'waiting',
        available: false
      };
      state.reservations.push(reservation);
      return reservation;
    }
  },

  async cancelReservation(reservationId) {
    const idx = state.reservations.findIndex(r => r.id === reservationId || r._id === reservationId);
    if (idx >= 0) {
      state.reservations.splice(idx, 1);
    }
    try {
      await api.cancelReservation(reservationId);
    } catch (err) {
      console.warn('API cancelReservation failed:', err.message);
    }
  },

  // --- Fines ---
  getFines() {
    return state.fines;
  },

  getFinesByMember(memberId) {
    return state.fines.filter(f => f.memberId === memberId);
  },

  calculateFine(borrowingId) {
    const borrowing = state.borrowings.find(b => b.id === borrowingId || b._id === borrowingId);
    if (!borrowing || borrowing.status === 'returned') return 0;
    const due = new Date(borrowing.dueDate);
    const now = new Date();
    const diff = Math.floor((now - due) / (1000 * 60 * 60 * 24));
    const fine = diff > 0 ? diff * 5 : 0;
    borrowing.fine = fine;
    if (fine > 0) borrowing.status = 'overdue';
    return fine;
  },

  async payFine(fineId) {
    const fine = state.fines.find(f => f.id === fineId || f._id === fineId);
    if (fine) {
      fine.status = 'paid';
      fine.paidOn = new Date().toISOString().split('T')[0];
    }
    try {
      await api.payFine(fineId);
    } catch (err) {
      console.warn('API payFine failed:', err.message);
    }
    return fine;
  },

  // --- Notifications ---
  getNotifications() {
    return state.notifications;
  },

  getNotificationsByMember(memberId) {
    return state.notifications.filter(n => n.memberId === memberId);
  },

  getUnreadCount(memberId) {
    return state.notifications.filter(n => (n.memberId === memberId || !n.memberId) && !n.read).length;
  },

  async markNotificationRead(notificationId) {
    const notif = state.notifications.find(n => n.id === notificationId || n._id === notificationId);
    if (notif) {
      notif.read = true;
    }
    try {
      await api.markNotificationRead(notificationId);
    } catch (err) {
      console.warn('API markNotificationRead failed:', err.message);
    }
  },

  async markAllRead(memberId) {
    state.notifications.forEach(n => {
      if (n.memberId === memberId || !n.memberId) n.read = true;
    });
    try {
      await api.markAllNotificationsRead();
    } catch (err) {
      console.warn('API markAllNotificationsRead failed:', err.message);
    }
  },

  async addNotification(memberId, type, title, message) {
    const notif = {
      id: 'n' + Date.now(),
      memberId,
      type,
      title,
      message,
      read: false,
      date: new Date().toISOString().split('T')[0]
    };
    state.notifications.unshift(notif);
    try {
      await api.addNotification(memberId, type, title, message);
    } catch (err) {
      // Local fallback
    }
    return notif;
  },

  addNotificationFromSocket(notification) {
    const exists = state.notifications.some(n => (n.id && n.id === notification.id) || (n._id && n._id === notification._id));
    if (!exists) {
      state.notifications.unshift(notification);
      document.dispatchEvent(new CustomEvent('sl:update-notifications'));
    }
  },

  // --- Wishlist ---
  getWishlist() {
    return state.wishlist;
  },

  toggleWishlist(bookId) {
    const idx = state.wishlist.indexOf(bookId);
    if (idx >= 0) {
      state.wishlist.splice(idx, 1);
    } else {
      state.wishlist.push(bookId);
    }
    saveWishlist();
  },

  isInWishlist(bookId) {
    return state.wishlist.includes(bookId);
  },

  // --- Session ---
  getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  setSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  clearSession() {
    localStorage.removeItem(SESSION_KEY);
  },

  // --- Reset ---
  resetData() {
    state.books = [];
    state.members = [];
    state.borrowings = [];
    state.reservations = [];
    state.fines = [];
    state.notifications = [];
  }
};
