/**
 * SmartLibrary - Firebase Client SDK Integration
 * Project: smartlibrary-eed97
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB5cZ0O7UrDC5ZuuiVxKVTYBKS-nAgNYr4",
  authDomain: "smartlibrary-eed97.firebaseapp.com",
  projectId: "smartlibrary-eed97",
  storageBucket: "smartlibrary-eed97.firebasestorage.app",
  messagingSenderId: "112150957377",
  appId: "1:112150957377:web:b69698b3fcdca2bcc765c0",
  measurementId: "G-LYL1ME7TQJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
};
