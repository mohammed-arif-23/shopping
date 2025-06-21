import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBoudCIwdSR4mMZxC6Oob3IRbf720Gw9uU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "store-7b1b8.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "store-7b1b8",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "store-7b1b8.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "611617459228",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:611617459228:web:836debfa4e5d41d45e23d9",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-NS4SFVYTL4"
};

// Validate Firebase config
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error("Firebase configuration is incomplete. Please check your .env.local file.");
  throw new Error("Firebase configuration is missing required environment variables.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Configure Google Auth Provider with additional settings
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  // Add additional parameters to help with domain validation
  hd: '*'
});

// Initialize Firestore
export const db = getFirestore(app);

// Debug: Log Firebase initialization (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log("Firebase initialized successfully");
  console.log("Using environment variables:", !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
}

export default app; 