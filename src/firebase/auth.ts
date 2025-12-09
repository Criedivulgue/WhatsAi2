'use client';

import { 
  signInWithEmailAndPassword as firebaseSignIn, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from './index'; // Import the initialized auth instance

/**
 * Signs a user in with their email and password.
 * @param email The user's email.
 * @param password The user's password.
 * @returns The user credential.
 */
export const signInWithEmailPassword = (email: string, password: string) => {
  return firebaseSignIn(auth, email, password);
};

/**
 * Creates a new user with email and password.
 * @param email The new user's email.
 * @param password The new user's password.
 * @returns The user credential.
 */
export const signUpWithEmailPassword = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
