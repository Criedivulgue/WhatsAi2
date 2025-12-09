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
type ContactFormData = Omit<Contact, 'id' | 'avatar' | 'categories' | 'interests' | 'brandId'>;

/**
 * Adds a new contact to the top-level 'contacts' collection.
 * Associates the contact with a brand via the brandId field.
 * @param firestore The Firestore instance.
 * @param brandId The ID of the brand this contact belongs to.
 * @param data The data for the new contact from the form.
 */
export async function addContact(
  firestore: Firestore,
  brandId: string,
  data: ContactFormData
) {
  // Complete the contact data with the brandId and other defaults
  const newContactData: Omit<Contact, 'id'> = {
    ...data,
    brandId,
    avatar: `avatar-${Math.floor(Math.random() * 6) + 1}`,
    categories: [],
    interests: [],
  };

  const contactsRef = collection(firestore, 'contacts');
  
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
 * Updates an existing contact's data in the top-level 'contacts' collection.
 * @param firestore The Firestore instance.
 * @param contactId The ID of the contact to update.
 * @param data The partial data to update.
 */
export async function updateContact(
  firestore: Firestore,
  contactId: string,
  data: Partial<ContactFormData>
) {
  const contactRef = doc(firestore, 'contacts', contactId);
  
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
 * Deletes a contact from the top-level 'contacts' collection.
 * @param firestore The Firestore instance.
 * @param contactId The ID of the contact to delete.
 */
export async function deleteContact(
  firestore: Firestore,
  contactId: string
) {
  const contactRef = doc(firestore, 'contacts', contactId);
  
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
