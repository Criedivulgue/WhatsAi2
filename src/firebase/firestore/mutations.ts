'use client';

import { doc, type Firestore, updateDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  type Auth,
} from 'firebase/auth';
import type { Brand, User, UserProfileData } from '@/lib/types';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';


// ==================================================================
// ONBOARDING & CREATION MUTATIONS (CORRECTED)
// ==================================================================

/**
 * Registers a new user with email and password in Firebase Authentication.
 * (Unchanged)
 */
export async function registerUserWithEmail(auth: Auth, email: string, password: string): Promise<string> {
  if (!password) {
    throw new Error('A senha é inválida ou não foi fornecida.');
  }
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user.uid;
}

/**
 * Creates the Brand and User documents during onboarding.
 * This function now correctly separates brand data from user data.
 * @param firestore The Firestore instance.
 * @param userId The UID of the user.
 * @param data The data from the onboarding form (UserProfileData).
 */
export async function createBrandAndUserProfile(
  firestore: Firestore,
  userId: string,
  data: UserProfileData
) {
  // 1. Create the Brand document with brand-specific info
  const brandData: Partial<Brand> = {
    brandName: data.publicName, // Map publicName to brandName
    slogan: data.slogan,
    city: data.city,
    state: data.state,
    whatsappNumber: data.whatsappNumber,
  };
  const brandCollectionRef = collection(firestore, 'brands');
  const brandDocRef = await addDoc(brandCollectionRef, { // CORRECTED: Fixed typo `brandCollectionGRef` -> `brandCollectionRef`
    ...brandData,
    createdAt: serverTimestamp(),
  });

  // 2. Create the User document with user-specific info and the link to the brand
  const userData: Partial<User> = {
    avatarUrl: data.avatarUrl || '',
    brandId: brandDocRef.id, // Link to the newly created brand
  };
  const userRef = doc(firestore, 'users', userId);
  await setDoc(userRef, {
    ...userData,
    id: userId, // explicitly set the user ID in the document
    createdAt: serverTimestamp(), 
  });

  return { userId, brandId: brandDocRef.id };
}

// ==================================================================
// UPDATE MUTATIONS (CORRECTED)
// ==================================================================

/**
 * Updates a user's core data in Firestore (e.g., avatar, persona).
 * This now correctly uses the `User` type.
 * @param firestore The Firestore instance.
 * @param userId The ID of the user to update.
 * @param data The data to update, conforming to the `User` type.
 */
export async function updateUserProfile(
  firestore: Firestore,
  userId: string,
  data: Partial<User> // CORRECTED: Now uses the specific User type
) {
  const userRef = doc(firestore, 'users', userId);
  try {
    await updateDoc(userRef, data);
  } catch (serverError) {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'update',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  }
}

/**
 * Updates a brand's data in Firestore.
 * (Unchanged, but now used correctly by the settings page)
 * @param firestore The Firestore instance.
 * @param brandId The ID of the brand to update.
 * @param data The data to update.
 */
export async function updateBrandData(
  firestore: Firestore,
  brandId: string,
  data: Partial<Brand>
) {
  const brandRef = doc(firestore, 'brands', brandId);
  try {
    await updateDoc(brandRef, data);
  } catch (serverError) {
    const permissionError = new FirestorePermissionError({
      path: brandRef.path,
      operation: 'update',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  }
}

// ==================================================================
// DEPRECATED FUNCTIONS
// ==================================================================

/**
 * @deprecated Use createBrandAndUserProfile instead.
 */
export async function createUserProfile(
  firestore: Firestore,
  userId: string,
  data: UserProfileData
) {
  console.warn("createUserProfile is deprecated. Use createBrandAndUserProfile instead.");
  // This function is now just a wrapper for the new logic to avoid breaking old calls.
  return createBrandAndUserProfile(firestore, userId, data);
}
