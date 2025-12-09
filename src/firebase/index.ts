'use client';

// #region Firebase Core Imports
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
// #endregion

// #region Firebase Hooks Imports
import { useAuthState as useFirebaseAuthState } from 'react-firebase-hooks/auth';
import { useDocument as useFirebaseDoc } from 'react-firebase-hooks/firestore';
import { useCollection as useFirebaseCollection } from 'react-firebase-hooks/firestore';
// #endregion

// #region Provider and Profile Imports
export {
  useAuth,
  useFirestore,
  useStorage,
  useFirebaseApp,
} from './provider';
import { useUserProfile } from './auth/user-profile-provider';
// #endregion

// #region Firebase Initialization
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase instances, ensuring it only happens once.
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// EXPORT the initialized instances directly to break the circular dependency
export const auth: Auth = getAuth(app);
export const firestore: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export { app as firebaseApp };
// #endregion

// #region Re-exported Hooks

/**
 * This is the OFFICIAL `useUser` hook for the entire application.
 * It re-exports the `useUserProfile` hook.
 */
export const useUser = useUserProfile;

/**
 * This hook provides the raw Firebase Auth user state.
 */
export const useAuthState = () => {
  const [user, loading, error] = useFirebaseAuthState(auth);
  return { user, loading, error };
};

// Re-export the main Firestore hooks for convenience throughout the app.
export { useFirebaseDoc as useDoc, useFirebaseCollection as useCollection };
// #endregion

// #region Helper Function Exports
// Export all helper functions from their respective files.
export * from './auth';
export * from './storage';
// #endregion
