'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type Auth,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  type FirebaseStorage
} from 'firebase/storage';
import { useEffect } from 'react';

// Correctly import hooks from their specific paths
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useCollection as useFirebaseCollection } from 'react-firebase-hooks/firestore';

// Re-export core context hooks
export {
  useAuth,
  useFirestore,
  useStorage,
  useFirebaseApp,
} from './provider';

const getServerFirebaseConfig = () => {
  if (process.env.FIREBASE_CONFIG) {
    try {
      return JSON.parse(process.env.FIREBASE_CONFIG);
    } catch (e) {
      console.error("Failed to parse FIREBASE_CONFIG:", e);
      return undefined; 
    }
  }
  return undefined;
}

const firebaseConfig = getServerFirebaseConfig() || {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase for client-side usage
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
firestore = getFirestore(app);
storage = getStorage(app);

export const initializeFirebase = () => {
  return { firebaseApp: app, auth, firestore, storage };
};

// Auth functions
export const signUpWithEmailPassword = (email: any, password: any) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmailPassword = (email: any, password: any) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Handles uploading a file to a specified path in Firebase Storage.
 * @param userId - The user's unique ID to create a user-specific folder.
 * @param folder - The top-level folder (e.g., 'avatars', 'documents').
 * @param file - The file object to upload.
 * @returns The public download URL of the uploaded file.
 */
export const uploadFileToStorage = async (userId: string, folder: string, file: File) => {
  if (!userId) throw new Error("User ID is required for uploading files.");
  // Create a unique, user-specific path to prevent overwrites.
  const filePath = `${folder}/${userId}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, filePath);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
};

/**
 * The official hook from `react-firebase-hooks/auth` for user state.
 * This replaces the custom, problematic `useUser` hook.
 * It returns an object to maintain compatibility with existing components.
 */
export const useUser = () => {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (error) {
      console.error('useAuthState Error:', error);
    }
  }, [error]);

  return { user, loading };
};

// Re-export firestore hooks for use throughout the app
export { useDocument as useDoc, useFirebaseCollection as useCollection };
