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

type ContactData = Omit<Contact, 'id' | 'brandId' | 'avatar' | 'categories' | 'interests'>;

/**
 * Adds a new contact to the database for a specific brand.
 * @param firestore The Firestore instance.
 * @param brandId The ID of the brand this contact belongs to.
 * @param data The data for the new contact.
 */
export function addContact(
  firestore: Firestore,
  brandId: string,
  data: ContactData
) {
  const newContactData = {
    ...data,
    brandId,
    avatar: `avatar-${Math.floor(Math.random() * 6) + 1}`, // Assign a random avatar
    categories: [], // Initialize with empty arrays
    interests: [], // Initialize with empty arrays
  };

  const contactsRef = collection(firestore, 'contacts');
  addDoc(contactsRef, newContactData).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: contactsRef.path,
      operation: 'create',
      requestResourceData: newContactData,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

/**
 * Updates an existing contact's data.
 * @param firestore The Firestore instance.
 * @param contactId The ID of the contact to update.
 * @param data The partial data to update.
 */
export function updateContact(
  firestore: Firestore,
  contactId: string,
  data: Partial<ContactData>
) {
  const contactRef = doc(firestore, 'contacts', contactId);
  updateDoc(contactRef, data).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: contactRef.path,
      operation: 'update',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

/**
 * Deletes a contact from the database.
 * @param firestore The Firestore instance.
 * @param contactId The ID of the contact to delete.
 */
export function deleteContact(firestore: Firestore, contactId: string) {
  const contactRef = doc(firestore, 'contacts', contactId);
  deleteDoc(contactRef).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: contactRef.path,
      operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}
