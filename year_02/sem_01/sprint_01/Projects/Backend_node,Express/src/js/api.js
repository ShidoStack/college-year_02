/**
 * SmartLibrary - API Service Layer
 * Prepared for the future Express.js + MongoDB backend.
 *
 * Currently uses mock data from the store.
 * To connect the real backend, replace the mock implementations
 * with fetch() calls to the corresponding API endpoints.
 *
 * Expected backend endpoints:
 *
 * AUTH:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *   POST /api/auth/firebase
 *
 * BOOKS:
 *   GET  /api/books
 *   GET  /api/books/:id
 *   POST /api/books
 *   PUT  /api/books/:id
 *   DELETE /api/books/:id
 *
 * MEMBERS:
 *   GET  /api/members
 *   GET  /api/members/:id
 *   POST /api/members
 *   PUT  /api/members/:id
 *
 * BORROW:
 *   POST /api/borrow
 *   PUT  /api/borrow/:id/return
 *   GET  /api/borrow
 *   GET  /api/borrow/user/:id
 *
 * RESERVATIONS:
 *   POST /api/reservations
 *   GET  /api/reservations
 *   DELETE /api/reservations/:id
 *
 * FINES:
 *   GET  /api/fines/user/:id
 *   POST /api/fines/calculate
 *   PUT  /api/fines/:id/pay
 *
 * REPORTS:
 *   GET  /api/reports/borrowing
 *   GET  /api/reports/popular-books
 *   GET  /api/reports/member-activity
 *
 * NOTIFICATIONS:
 *   GET  /api/notifications
 *   POST /api/notifications
 */

import { store } from './store.js';

// Set to false when backend is ready, then uncomment fetch() calls below
const USE_MOCK = true;

// Change this when the backend is deployed
const API_BASE = '/api';

/**
 * Helper for making API calls when backend is connected.
 * Currently unused but ready for production.
 */
async function apiCall(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) options.body = JSON.stringify(body);

  // Attach JWT token if available
  const session = store.getSession();
  if (session && session.token) {
    options.headers['Authorization'] = `Bearer ${session.token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API ${method} ${endpoint} failed: ${response.status}`);
  }
  return response.json();
}

export const api = {
  // ---- AUTH ----
  async login(email, password) {
    if (USE_MOCK) {
      return mockLogin(email, password);
    }
    // return apiCall('POST', '/auth/login', { email, password });
  },

  async register(data) {
    if (USE_MOCK) {
      return mockRegister(data);
    }
    // return apiCall('POST', '/auth/register', data);
  },

  // ---- BOOKS ----
  async getBooks() {
    if (USE_MOCK) return store.getBooks();
    // return apiCall('GET', '/books');
  },

  async getBook(id) {
    if (USE_MOCK) return store.getBook(id);
    // return apiCall('GET', `/books/${id}`);
  },

  async addBook(book) {
    if (USE_MOCK) return store.addBook(book);
    // return apiCall('POST', '/books', book);
  },

  async updateBook(id, updates) {
    if (USE_MOCK) return store.updateBook(id, updates);
    // return apiCall('PUT', `/books/${id}`, updates);
  },

  async deleteBook(id) {
    if (USE_MOCK) { store.deleteBook(id); return true; }
    // return apiCall('DELETE', `/books/${id}`);
  },

  // ---- MEMBERS ----
  async getMembers() {
    if (USE_MOCK) return store.getMembers();
    // return apiCall('GET', '/members');
  },

  async getMember(id) {
    if (USE_MOCK) return store.getMember(id);
    // return apiCall('GET', `/members/${id}`);
  },

  async addMember(member) {
    if (USE_MOCK) return store.addMember(member);
    // return apiCall('POST', '/members', member);
  },

  async updateMember(id, updates) {
    if (USE_MOCK) return store.updateMember(id, updates);
    // return apiCall('PUT', `/members/${id}`, updates);
  },

  // ---- BORROW ----
  async getBorrowings() {
    if (USE_MOCK) return store.getBorrowings();
    // return apiCall('GET', '/borrow');
  },

  async getBorrowingsByUser(memberId) {
    if (USE_MOCK) return store.getBorrowingsByMember(memberId);
    // return apiCall('GET', `/borrow/user/${memberId}`);
  },

  async borrowBook(bookId, memberId) {
    if (USE_MOCK) return store.addBorrowing(bookId, memberId);
    // return apiCall('POST', '/borrow', { bookId, memberId });
  },

  async returnBook(borrowingId) {
    if (USE_MOCK) return store.returnBook(borrowingId);
    // return apiCall('PUT', `/borrow/${borrowingId}/return`);
  },

  // ---- RESERVATIONS ----
  async getReservations() {
    if (USE_MOCK) return store.getReservations();
    // return apiCall('GET', '/reservations');
  },

  async reserveBook(bookId, memberId) {
    if (USE_MOCK) return store.addReservation(bookId, memberId);
    // return apiCall('POST', '/reservations', { bookId, memberId });
  },

  async cancelReservation(reservationId) {
    if (USE_MOCK) { store.cancelReservation(reservationId); return true; }
    // return apiCall('DELETE', `/reservations/${reservationId}`);
  },

  // ---- FINES ----
  async getFines() {
    if (USE_MOCK) return store.getFines();
    // return apiCall('GET', '/fines');
  },

  async getFinesByUser(memberId) {
    if (USE_MOCK) return store.getFinesByMember(memberId);
    // return apiCall('GET', `/fines/user/${memberId}`);
  },

  async calculateFine(borrowingId) {
    if (USE_MOCK) return store.calculateFine(borrowingId);
    // return apiCall('POST', '/fines/calculate', { borrowingId });
  },

  async payFine(fineId) {
    if (USE_MOCK) return store.payFine(fineId);
    // return apiCall('PUT', `/fines/${fineId}/pay`);
  },

  // ---- NOTIFICATIONS ----
  async getNotifications() {
    if (USE_MOCK) return store.getNotifications();
    // return apiCall('GET', '/notifications');
  },

  async addNotification(memberId, type, title, message) {
    if (USE_MOCK) return store.addNotification(memberId, type, title, message);
    // return apiCall('POST', '/notifications', { memberId, type, title, message });
  },

  // ---- REPORTS ----
  async getBorrowingReport() {
    if (USE_MOCK) {
      const borrowings = store.getBorrowings();
      return borrowings;
    }
    // return apiCall('GET', '/reports/borrowing');
  },

  async getPopularBooksReport() {
    if (USE_MOCK) {
      const borrowings = store.getBorrowings();
      const counts = {};
      borrowings.forEach(b => {
        counts[b.bookId] = (counts[b.bookId] || 0) + 1;
      });
      return Object.entries(counts)
        .map(([bookId, count]) => ({ bookId, count, book: store.getBook(bookId) }))
        .sort((a, b) => b.count - a.count);
    }
    // return apiCall('GET', '/reports/popular-books');
  },

  async getMemberActivityReport() {
    if (USE_MOCK) {
      const members = store.getMembers();
      const borrowings = store.getBorrowings();
      return members.map(m => ({
        ...m,
        totalBorrowed: borrowings.filter(b => b.memberId === m.id).length
      })).sort((a, b) => b.totalBorrowed - a.totalBorrowed);
    }
    // return apiCall('GET', '/reports/member-activity');
  }
};

// ---- Mock auth implementations ----
function mockLogin(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const member = store.getMemberByEmail(email);
      if (!member) {
        reject(new Error('No account found with this email.'));
        return;
      }
      // Demo passwords - in production these come from the backend
      const demoPasswords = {
        'rahul.s@college.edu': 'student123',
        'meena.i@college.edu': 'librarian123'
      };
      if (demoPasswords[email] !== password) {
        reject(new Error('Incorrect password.'));
        return;
      }
      resolve({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        membershipId: member.membershipId,
        token: 'demo-jwt-token-' + Date.now()
      });
    }, 300);
  });
}

function mockRegister(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (store.getMemberByEmail(data.email)) {
        reject(new Error('An account with this email already exists.'));
        return;
      }
      const member = store.addMember({
        name: data.name,
        email: data.email,
        membershipId: data.membershipId,
        role: 'student',
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0],
        booksBorrowed: 0,
        outstandingFine: 0
      });
      resolve({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        membershipId: member.membershipId,
        token: 'demo-jwt-token-' + Date.now()
      });
    }, 300);
  });
}

/**
 * Socket.io initialization stub.
 *
 * When the backend is ready, uncomment the socket.io code
 * and point it to the server URL:
 *
 *   import { io } from 'socket.io-client';
 *   const socket = io('http://localhost:3000');
 *
 *   socket.on('book:borrowed', (data) => {
 *     store.updateBook(data.bookId, { availableCopies: data.availableCopies });
 *     ui.toast(`${data.bookTitle} was borrowed.`);
 *   });
 *
 *   socket.on('book:returned', (data) => {
 *     store.updateBook(data.bookId, { availableCopies: data.availableCopies });
 *     ui.toast(`${data.bookTitle} was returned.`);
 *   });
 *
 *   socket.on('reservation:ready', (data) => {
 *     store.addNotification(data.memberId, 'reservation_ready',
 *       'Reserved book available', `${data.bookTitle} is now available.`);
 *   });
 */
export function initializeSocket() {
  // Socket.io will be initialized here when backend is connected.
  // For now, real-time updates are simulated through the store.
  console.log('[SmartLibrary] Socket.io not yet connected - using simulated real-time updates.');
}
