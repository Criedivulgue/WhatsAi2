'use client';

import { doc, writeBatch, type Firestore, updateDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  type Auth,
} from 'firebase/auth';
import type { OnboardingData, Brand, User } from '@/lib/types';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/**
 * Creates a new brand and a new user (attendant) in a single transaction.
 * This is the primary function for the onboarding flow.
 * @param auth The Firebase Auth instance.
 * @param firestore The Firestore instance.
 * @param data The complete data from the onboarding form.
 */
export async function createBrandAndUser(
  auth: Auth,
  firestore: Firestore,
  data: OnboardingData
) {
  const {
    attendantEmail,
    password,
    attendantName,
    brandName,
    brandTone,
    knowledgeBase,
    hardRules,
    softRules,
    autoSummarize,
    autoEnrich,
    autoFollowUp
  } = data;

  if (typeof password !== 'string' || !password) {
    throw new Error('A senha é inválida ou não foi fornecida.');
  }

  // Step 1: Create the user in Firebase Authentication
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    attendantEmail,
    password
  );
  const user = userCredential.user;

  // Step 2: Update the user's display name in their Auth profile
  await updateProfile(user, { displayName: attendantName });

  // Step 3: Use a batch write to create brand and user docs in Firestore atomically
  const batch = writeBatch(firestore);

  // Create a document for the brand
  const brandRef = doc(firestore, 'brands', user.uid); // Using user's UID as brand ID for simplicity
  batch.set(brandRef, {
    brandName,
    brandTone,
    knowledgeBase: knowledgeBase || '',
    hardRules: hardRules || '',
    softRules: softRules || '',
    ownerId: user.uid,
    aiConfig: {
      autoSummarize,
      autoEnrich,
      autoFollowUp,
    }
  });

  // Create a document for the user's profile
  const userRef = doc(firestore, 'users', user.uid);
  batch.set(userRef, {
    name: attendantName,
    email: attendantEmail,
    brandId: brandRef.id,
  });

  // Step 4: Commit the batch write
  await batch.commit();

  return { userId: user.uid, brandId: brandRef.id };
}


/**
 * Updates a brand's data in Firestore.
 * @param firestore The Firestore instance.
 * @param brandId The ID of the brand to update.
 * @param data The data to update.
 */
export function updateBrandData(
  firestore: Firestore,
  brandId: string,
  data: Partial<Brand>
) {
  const brandRef = doc(firestore, 'brands', brandId);
  updateDoc(brandRef, data).catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: brandRef.path,
        operation: 'update',
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
}

/**
 * Updates a user's profile data in Firestore.
 * @param firestore The Firestore instance.
 * @param userId The ID of the user to update.
 * @param data The data to update.
 */
export function updateUserProfile(
  firestore: Firestore,
  userId: string,
  data: Partial<User>
) {
  const userRef = doc(firestore, 'users', userId);
  updateDoc(userRef, data).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'update',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}
