import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoPlaceholderKeyForEval2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "careerbridge-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "careerbridge-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "careerbridge-ai.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

let app = null;
let auth = null;
let isFirebaseLive = false;

try {
  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    isFirebaseLive = true;
    console.log("[Firebase] Live client SDK configured with project:", firebaseConfig.projectId);
  } else {
    // Evaluation / hackathon demo mode fallback
    console.log("[Firebase] Running in evaluation demo mode. Real Firebase SDK available when VITE_FIREBASE_API_KEY is supplied.");
  }
} catch (error) {
  console.warn("[Firebase] Initialization notice:", error.message);
}

export {
  auth,
  isFirebaseLive,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
};
