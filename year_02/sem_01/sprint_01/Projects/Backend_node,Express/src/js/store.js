/**
 * SmartLibrary - State Store
 * Centralized application state with localStorage persistence.
 * All views read from and write to this store.
 */

import { mockBooks, mockMembers, mockBorrowings, mockReservations, mockFines, mockNotifications } from './data.js';

const STORAGE_KEY = 'smartlibrary_state_v1';
const SESSION_KEY = 'smartlibrary_session_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore corrupt state */ }
  return null;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* quota exceeded - ignore */ }
}

const defaultState = {
  books: mockBooks,
  members: mockMembers,
  borrowings: mockBorrowings,
  reservations: mockReservations,
  fines: mockFines,
  notifications: mockNotifications,
  wishlist: []
};

const persisted = loadState();
const state = persisted || { ...defaultState };

// Ensure all keys exist (for forward-compatibility)
for (const key of Object.keys(defaultState)) {
  if (!(key in state)) state[key] = defaultState[key];
}

saveState();

export const store = {
  getState() {
    return state;
  },

  // --- Books ---
  getBooks() {
    return state.books;
  },

  getBook(id) {
    return state.books.find(b => b.id === id);
  },

  addBook(book) {
    book.id = 'b' + String(state.books.length + 1).padStart(3, '0');
    state.books.push(book);
    saveState();
    return book;
  },

  updateBook(id, updates) {
    const book = state.books.find(b => b.id === id);
    if (book) {
      Object.assign(book, updates);
      saveState();
    }
    return book;
  },

  deleteBook(id) {
    const idx = state.books.findIndex(b => b.id === id);
    if (idx >= 0) {
      state.books.splice(idx, 1);
      saveState();
    }
  },

  // --- Members ---
  getMembers() {
    return state.members;
  },

  getMember(id) {
    return state.members.find(m => m.id === id);
  },

  getMemberByEmail(email) {
    return state.members.find(m => m.email === email);
  },

  addMember(member) {
    member.id = 'm' + String(state.members.length + 1).padStart(3, '0');
    state.members.push(member);
    saveState();
    return member;
  },

  updateMember(id, updates) {
    const member = state.members.find(m => m.id === id);
    if (member) {
      Object.assign(member, updates);
      saveState();
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

  addBorrowing(bookId, memberId) {
    const book = this.getBook(bookId);
    if (!book || book.availableCopies <= 0) return null;

    const today = new Date();
    const due = new Date(today);
    due.setDate(due.getDate() + 14);

    const borrowing = {
      id: 'br' + String(state.borrowings.length + 1).padStart(3, '0'),
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
    saveState();
    return borrowing;
  },

  returnBook(borrowingId) {
    const borrowing = state.borrowings.find(b => b.id === borrowingId);
    if (!borrowing || borrowing.status === 'returned') return null;

    const today = new Date().toISOString().split('T')[0];
    borrowing.returnDate = today;
    borrowing.status = 'returned';

    const book = this.getBook(borrowing.bookId);
    if (book) book.availableCopies++;

    this.updateMemberBorrowCount(borrowing.memberId);
    saveState();
    return borrowing;
  },

  updateMemberBorrowCount(memberId) {
    const member = this.getMember(memberId);
    if (!member) return;
    member.booksBorrowed = state.borrowings.filter(
      b => b.memberId === memberId && (b.status === 'borrowed' || b.status === 'overdue')
    ).length;
  },

  // --- Reservations ---
  getReservations() {
    return state.reservations;
  },

  getReservationsByMember(memberId) {
    return state.reservations.filter(r => r.memberId === memberId);
  },

  addReservation(bookId, memberId) {
    const reservation = {
      id: 'r' + String(state.reservations.length + 1).padStart(3, '0'),
      bookId,
      memberId,
      reservedOn: new Date().toISOString().split('T')[0],
      status: 'waiting',
      available: false
    };
    state.reservations.push(reservation);
    saveState();
    return reservation;
  },

  cancelReservation(reservationId) {
    const idx = state.reservations.findIndex(r => r.id === reservationId);
    if (idx >= 0) {
      state.reservations.splice(idx, 1);
      saveState();
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
    const borrowing = state.borrowings.find(b => b.id === borrowingId);
    if (!borrowing || borrowing.status === 'returned') return 0;

    const due = new Date(borrowing.dueDate);
    const now = new Date();
    const diff = Math.floor((now - due) / (1000 * 60 * 60 * 24));
    const fine = diff > 0 ? diff * 5 : 0;

    borrowing.fine = fine;
    if (fine > 0) borrowing.status = 'overdue';
    saveState();
    return fine;
  },

  payFine(fineId) {
    const fine = state.fines.find(f => f.id === fineId);
    if (fine) {
      fine.status = 'paid';
      fine.paidOn = new Date().toISOString().split('T')[0];
      saveState();
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
    return state.notifications.filter(n => n.memberId === memberId && !n.read).length;
  },

  markNotificationRead(notificationId) {
    const notif = state.notifications.find(n => n.id === notificationId);
    if (notif) {
      notif.read = true;
      saveState();
    }
  },

  markAllRead(memberId) {
    state.notifications.forEach(n => {
      if (n.memberId === memberId) n.read = true;
    });
    saveState();
  },

  addNotification(memberId, type, title, message) {
    const notif = {
      id: 'n' + String(state.notifications.length + 1).padStart(3, '0'),
      memberId,
      type,
      title,
      message,
      read: false,
      date: new Date().toISOString().split('T')[0]
    };
    state.notifications.push(notif);
    saveState();
    return notif;
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
    saveState();
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
    Object.assign(state, {
      books: [...mockBooks],
      members: [...mockMembers],
      borrowings: [...mockBorrowings],
      reservations: [...mockReservations],
      fines: [...mockFines],
      notifications: [...mockNotifications],
      wishlist: []
    });
    saveState();
  }
};
