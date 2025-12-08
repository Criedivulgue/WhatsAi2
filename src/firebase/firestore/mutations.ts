'use client';

import { doc, setDoc, writeBatch } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  type Auth,
} from 'firebase/auth';
import { useFirestore } from '../provider';
import type { OnboardingData } from '@/lib/types';

/**
 * Creates a new brand and a new user (attendant) in a single transaction.
 * This is the primary function for the onboarding flow.
 * @param auth The Firebase Auth instance.
 * @param data The complete data from the onboarding form.
 */
export async function createBrandAndUser(auth: Auth, data: OnboardingData) {
  const {
    attendantEmail,
    password,
    attendantName,
    brandName,
    brandTone,
    hardRules,
    softRules,
    ...aiConfig
  } = data;

  if (!password) {
    throw new Error('A senha é obrigatória para criar um novo usuário.');
  }

  const firestore = useFirestore();

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
    hardRules: hardRules || '',
    softRules: softRules || '',
    ownerId: user.uid,
    aiConfig,
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
