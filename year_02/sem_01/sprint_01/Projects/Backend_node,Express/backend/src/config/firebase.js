const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = require('./env');

let firebaseApp = null;
let isConfigured = false;

const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Render production: user pastes the JSON string directly into environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    isConfigured = true;
    console.log('[SmartLibrary] Firebase Admin SDK initialized successfully via FIREBASE_SERVICE_ACCOUNT env var.');
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    // Render production alternative: base64 encoded JSON string
    const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
    const serviceAccount = JSON.parse(decoded);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    isConfigured = true;
    console.log('[SmartLibrary] Firebase Admin SDK initialized successfully via FIREBASE_SERVICE_ACCOUNT_BASE64 env var.');
  } else if (fs.existsSync(serviceAccountPath)) {
    // Local development: read from gitignored local file
    const serviceAccount = require(serviceAccountPath);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    isConfigured = true;
    console.log('[SmartLibrary] Firebase Admin SDK initialized successfully via local serviceAccountKey.json.');
  } else if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
    isConfigured = true;
    console.log('[SmartLibrary] Firebase Admin SDK initialized successfully via individual environment variables.');
  } else {
    console.log('[SmartLibrary] Firebase credentials not configured. Firebase Auth will verify JWTs or accept demo tokens in dev mode.');
  }
} catch (err) {
  console.warn(`[SmartLibrary] Firebase Admin SDK initialization failed: ${err.message}`);
}

const verifyFirebaseToken = async (idToken) => {
  if (!idToken) {
    throw new Error('ID token is required.');
  }

  if (isConfigured && firebaseApp) {
    return await admin.auth().verifyIdToken(idToken);
  }

  // Fallback in development mode when Firebase Admin credentials are not yet supplied:
  // Decodes base64 payload if token is in JWT format or demo token format
  if (process.env.NODE_ENV !== 'production') {
    try {
      const parts = idToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        return {
          uid: payload.user_id || payload.sub || payload.uid || 'demo-firebase-uid',
          email: payload.email || 'firebase.user@college.edu',
          name: payload.name || 'Firebase User'
        };
      }
    } catch (e) {
      // ignore
    }
    return {
      uid: 'demo-firebase-uid-' + idToken.substring(0, 8),
      email: 'firebase.student@college.edu',
      name: 'Firebase Student'
    };
  }

  throw new Error('Firebase Admin SDK is not configured on this server.');
};

module.exports = {
  admin,
  isConfigured,
  verifyFirebaseToken
};
