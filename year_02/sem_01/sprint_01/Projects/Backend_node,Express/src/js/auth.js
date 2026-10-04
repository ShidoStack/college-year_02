/**
 * SmartLibrary - Authentication
 * Demo authentication using localStorage.
 * Structured so the backend can replace this later.
 */

import { api } from './api.js';
import { store } from './store.js';
import { toast } from './ui.js';

export const auth = {
  currentSession: null,

  init() {
    this.currentSession = store.getSession();
  },

  isLoggedIn() {
    return !!this.currentSession;
  },

  isLibrarian() {
    return this.currentSession && this.currentSession.role === 'librarian';
  },

  isStudent() {
    return this.currentSession && this.currentSession.role === 'student';
  },

  getCurrentMember() {
    if (!this.currentSession) return null;
    return store.getMember(this.currentSession.id);
  },

  async login(email, password) {
    try {
      const session = await api.login(email, password);
      this.currentSession = session;
      store.setSession(session);
      toast(`Welcome back, ${session.name}!`, 'success');
      return session;
    } catch (err) {
      toast(err.message, 'error');
      throw err;
    }
  },

  async register(data) {
    try {
      const session = await api.register(data);
      this.currentSession = session;
      store.setSession(session);
      toast(`Account created. Welcome, ${session.name}!`, 'success');
      return session;
    } catch (err) {
      toast(err.message, 'error');
      throw err;
    }
  },

  logout() {
    this.currentSession = null;
    store.clearSession();
    toast('You have been logged out.', 'info');
    window.location.href = './login.html';
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = './login.html';
      return false;
    }
    return true;
  },

  requireLibrarian() {
    if (!this.requireAuth()) return false;
    if (!this.isLibrarian()) {
      toast('Librarian access required.', 'error');
      return false;
    }
    return true;
  }
};
