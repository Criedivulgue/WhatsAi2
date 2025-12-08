'use client';

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  type Firestore,
} from 'firebase/firestore';
import type { Contact } from '@/lib/types';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

// This type defines the data coming directly from the form
type ContactFormData = Omit<Contact, 'id' | 'avatar' | 'categories' | 'interests'>;

/**
 * Adds a new contact to a user's subcollection in the database.
 * This function completes the contact data with default values.
 * @param firestore The Firestore instance.
 * @param userId The ID of the user who owns this contact.
 * @param data The data for the new contact from the form.
 */
export async function addContact(
  firestore: Firestore,
  userId: string,
  data: ContactFormData
) {
  // Complete the contact data with default/generated values
  const newContactData: Omit<Contact, 'id'> = {
    ...data,
    avatar: `avatar-${Math.floor(Math.random() * 6) + 1}`, 
    categories: [],
    interests: [],
  };

  const contactsRef = collection(firestore, 'users', userId, 'contacts');
  
  try {
    await addDoc(contactsRef, newContactData);
  } catch (serverError) {
    const permissionError = new FirestorePermissionError({
      path: contactsRef.path,
      operation: 'create',
      requestResourceData: newContactData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  }
}

/**
 * Updates an existing contact's data within a user's subcollection.
 * @param firestore The Firestore instance.
 * @param userId The ID of the user who owns this contact.
 * @param contactId The ID of the contact to update.
 * @param data The partial data to update.
 */
export async function updateContact(
  firestore: Firestore,
  userId: string,
  contactId: string,
  data: Partial<ContactFormData>
) {
  const contactRef = doc(firestore, 'users', userId, 'contacts', contactId);
  
  try {
    await updateDoc(contactRef, data);
  } catch (serverError) {
    const permissionError = new FirestorePermissionError({
      path: contactRef.path,
      operation: 'update',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  }
}

/**
 * Deletes a contact from a user's subcollection.
 * @param firestore The Firestore instance.
 * @param userId The ID of the user who owns this contact.
 * @param contactId The ID of the contact to delete.
 */
export async function deleteContact(
  firestore: Firestore,
  userId: string,
  contactId: string
) {
  const contactRef = doc(firestore, 'users', userId, 'contacts', contactId);
  
  try {
    await deleteDoc(contactRef);
  } catch (serverError) {
    const permissionError = new FirestorePermissionError({
      path: contactRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  }
}
