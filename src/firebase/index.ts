'use client';

// This file is the single point of entry for all Firebase-related functionality in the app.
// By centralizing exports here, we can ensure consistency and avoid import errors.

// #region Core Firebase Services and Config
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

// Initialize Firebase and export the core services
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { firebaseApp, auth, firestore, storage, firebaseConfig };
// #endregion

// #region Authentication
// Export authentication functions (e.g., for login/signup pages)
export { signInWithEmailPassword, signUpWithEmailPassword } from './auth';
// Export the primary hook for accessing the authenticated user's state
export { useUser } from './auth/use-user';
// Export the provider that composes the user profile
export { UserProfileProvider, useUserProfile } from './auth/user-profile-provider';
// #endregion

// #region Firebase Hooks (from react-firebase-hooks)
// Re-exporting with the consistent names used throughout the app
export { useAuthState } from 'react-firebase-hooks/auth';
export { useDocument as useDoc } from 'react-firebase-hooks/firestore';
export { useCollection } from 'react-firebase-hooks/firestore'; // <-- ADDED
export { useObjectVal } from 'react-firebase-hooks/database';
// #endregion


// #region Custom Provider Hooks
// Hooks for accessing the core Firebase instances from within the provider context
export { useAuth, useFirestore, useStorage, useFirebaseApp } from './provider';
// #endregion

// #region Storage
export { uploadFileToStorage } from './storage'; // <-- ADDED
// #endregion
