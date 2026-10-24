/**
 * SmartLibrary - Authentication
 * Supports Firebase Auth (primary) + direct JWT login fallback.
 */

import { api } from './api.js';
import { store } from './store.js';
import { toast } from './ui.js';
import {
  auth as firebaseAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from './firebase.js';

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

  /**
   * Firebase-first login:
   * 1. Authenticates with Firebase (email/password)
   * 2. Gets Firebase ID token → exchanges with backend for a SmartLibrary session
   *
   * Fallback: if the account exists in MongoDB but not Firebase yet
   * (e.g. seeded demo accounts like meena.i@college.edu), falls back
   * to direct JWT login automatically.
   */
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const idToken = await userCredential.user.getIdToken();
      const session = await api.firebaseAuth(idToken);
      this.currentSession = session;
      store.setSession(session);
      toast(`Welcome back, ${session.name}!`, 'success');
      return session;
    } catch (firebaseErr) {
      // Fallback to direct JWT for seeded/demo accounts not yet in Firebase
      if (firebaseErr.code && (
        firebaseErr.code.includes('user-not-found') ||
        firebaseErr.code.includes('invalid-credential') ||
        firebaseErr.code.includes('invalid-login-credentials')
      )) {
        try {
          const session = await api.login(email, password);
          this.currentSession = session;
          store.setSession(session);
          toast(`Welcome back, ${session.name}!`, 'success');
          return session;
        } catch (jwtErr) {
          toast(jwtErr.message || 'Invalid email or password.', 'error');
          throw jwtErr;
        }
      }
      const msg = this._friendlyFirebaseError(firebaseErr.code);
      toast(msg, 'error');
      throw new Error(msg);
    }
  },

  /**
   * Firebase-first registration:
   * 1. Creates account in Firebase Authentication
   * 2. Sets display name on the Firebase user profile
   * 3. Gets Firebase ID token
   * 4. Exchanges ID token with backend — backend auto-creates MongoDB user
   */
  async register({ name, email, membershipId, password }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      // Set display name in Firebase
      await updateProfile(userCredential.user, { displayName: name });
      const idToken = await userCredential.user.getIdToken();
      // Backend creates the user in MongoDB using the Firebase profile
      // We pass membershipId as a custom claim via the request body
      const session = await api.firebaseAuthWithMembership(idToken, name, membershipId);
      this.currentSession = session;
      store.setSession(session);
      toast(`Account created. Welcome, ${session.name}!`, 'success');
      return session;
    } catch (firebaseErr) {
      const msg = this._friendlyFirebaseError(firebaseErr.code || firebaseErr.message);
      toast(msg, 'error');
      throw new Error(msg);
    }
  },

  /**
   * Signs out from both Firebase and the SmartLibrary session.
   */
  async logout() {
    try {
      await firebaseSignOut(firebaseAuth);
    } catch (_) {
      // ignore firebase sign-out errors
    }
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
  },

  _friendlyFirebaseError(code = '') {
    if (code.includes('user-not-found') || code.includes('invalid-credential') || code.includes('wrong-password')) {
      return 'Invalid email or password.';
    }
    if (code.includes('email-already-in-use')) {
      return 'An account with this email already exists.';
    }
    if (code.includes('weak-password')) {
      return 'Password must be at least 6 characters.';
    }
    if (code.includes('invalid-email')) {
      return 'Invalid email address format.';
    }
    if (code.includes('too-many-requests')) {
      return 'Too many failed attempts. Please try again later.';
    }
    return code || 'Authentication failed. Please try again.';
  }
};

