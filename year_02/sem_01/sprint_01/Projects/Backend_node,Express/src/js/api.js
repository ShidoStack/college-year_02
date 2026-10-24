/**
 * SmartLibrary - API Service Layer
 * Connected to the Express.js + MongoDB backend.
 *
 * Backend runs at http://localhost:5000
 * Frontend dev server proxies /api → backend via vite.config.js
 */

import { store } from './store.js';

// Backend base URL — Vite proxies /api to http://localhost:5001/api
const API_BASE = '/api';

/**
 * Core fetch wrapper with automatic JWT injection and error handling.
 */
async function apiCall(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (body) options.body = JSON.stringify(body);

  const session = store.getSession();
  if (session && session.token) {
    options.headers['Authorization'] = `Bearer ${session.token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  const json = await response.json().catch(() => ({ success: false, message: 'Invalid server response.' }));

  if (!response.ok || !json.success) {
    const err = new Error(json.message || `Request failed: ${response.status}`);
    err.statusCode = response.status;
    err.code = json.error;
    throw err;
  }

  return json.data;
}

export const api = {
  // ---- AUTH ----
  async login(email, password) {
    return apiCall('POST', '/auth/login', { email, password });
  },

  async register(data) {
    return apiCall('POST', '/auth/register', data);
  },

  async firebaseAuth(idToken) {
    return apiCall('POST', '/auth/firebase', { idToken });
  },

  async firebaseAuthWithMembership(idToken, name, membershipId) {
    return apiCall('POST', '/auth/firebase', { idToken, name, membershipId });
  },

  async getMe() {
    return apiCall('GET', '/auth/me');
  },

  // ---- BOOKS ----
  async getBooks(query = {}) {
    const params = new URLSearchParams(query).toString();
    return apiCall('GET', `/books${params ? '?' + params : ''}`);
  },

  async getBook(id) {
    return apiCall('GET', `/books/${id}`);
  },

  async addBook(book) {
    return apiCall('POST', '/books', book);
  },

  async updateBook(id, updates) {
    return apiCall('PUT', `/books/${id}`, updates);
  },

  async deleteBook(id) {
    return apiCall('DELETE', `/books/${id}`);
  },

  // ---- MEMBERS ----
  async getMembers(query = {}) {
    const params = new URLSearchParams(query).toString();
    return apiCall('GET', `/members${params ? '?' + params : ''}`);
  },

  async getMember(id) {
    return apiCall('GET', `/members/${id}`);
  },

  async addMember(member) {
    return apiCall('POST', '/members', member);
  },

  async updateMember(id, updates) {
    return apiCall('PUT', `/members/${id}`, updates);
  },

  // ---- BORROW ----
  async getBorrowings(query = {}) {
    const params = new URLSearchParams(query).toString();
    return apiCall('GET', `/borrow${params ? '?' + params : ''}`);
  },

  async getBorrowingsByUser(memberId) {
    return apiCall('GET', `/borrow/user/${memberId}`);
  },

  async borrowBook(bookId, memberId) {
    return apiCall('POST', '/borrow', { bookId, memberId });
  },

  async returnBook(borrowingId) {
    return apiCall('PUT', `/borrow/${borrowingId}/return`);
  },

  // ---- RESERVATIONS ----
  async getReservations(query = {}) {
    const params = new URLSearchParams(query).toString();
    return apiCall('GET', `/reservations${params ? '?' + params : ''}`);
  },

  async reserveBook(bookId, memberId) {
    return apiCall('POST', '/reservations', { bookId, memberId });
  },

  async cancelReservation(reservationId) {
    return apiCall('DELETE', `/reservations/${reservationId}`);
  },

  // ---- FINES ----
  async getFines() {
    return apiCall('GET', '/fines');
  },

  async getFinesByUser(memberId) {
    return apiCall('GET', `/fines/user/${memberId}`);
  },

  async calculateFine(borrowingId) {
    return apiCall('POST', '/fines/calculate', { borrowingId });
  },

  async payFine(fineId) {
    return apiCall('PUT', `/fines/${fineId}/pay`);
  },

  // ---- NOTIFICATIONS ----
  async getNotifications(query = {}) {
    const params = new URLSearchParams(query).toString();
    return apiCall('GET', `/notifications${params ? '?' + params : ''}`);
  },

  async addNotification(memberId, type, title, message) {
    return apiCall('POST', '/notifications', { memberId, type, title, message });
  },

  async markNotificationRead(id) {
    return apiCall('PATCH', `/notifications/${id}/read`);
  },

  async markAllNotificationsRead() {
    return apiCall('PATCH', '/notifications/read-all');
  },

  // ---- REPORTS ----
  async getBorrowingReport() {
    return apiCall('GET', '/reports/borrowing');
  },

  async getPopularBooksReport() {
    return apiCall('GET', '/reports/popular-books');
  },

  async getMemberActivityReport() {
    return apiCall('GET', '/reports/member-activity');
  }
};

/**
 * Socket.io real-time updates.
 * Connects to the backend and syncs book availability changes live.
 */
export function initializeSocket() {
  // Dynamically import socket.io-client only when backend is available
  import('https://cdn.socket.io/4.7.5/socket.io.esm.min.js')
    .then(({ io }) => {
      const session = store.getSession();
      const socketUrl = window.location.origin.includes(':5173') ? 'http://localhost:5001' : window.location.origin;
      const socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        query: session ? { memberId: session.id } : {}
      });

      socket.on('connect', () => {
        console.log('[SmartLibrary] Socket.io connected:', socket.id);
      });

      socket.on('book:availability', ({ bookId, availableCopies }) => {
        // Update local store so the catalog reflects live changes
        store.updateBook(bookId, { availableCopies });
      });

      socket.on('notification:new', (notification) => {
        if (notification && notification.message) {
          store.addNotificationFromSocket(notification);
        }
      });

      socket.on('disconnect', () => {
        console.log('[SmartLibrary] Socket.io disconnected.');
      });
    })
    .catch(() => {
      // Silently fallback — app works fine without real-time
      console.log('[SmartLibrary] Real-time updates unavailable.');
    });
}
