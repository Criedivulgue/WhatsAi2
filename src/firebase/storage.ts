'use client';

import { 
  ref, 
  uploadBytes, 
  getDownloadURL
} from 'firebase/storage';
import { storage } from './index'; // Import the initialized storage instance

/**
 * Uploads a file to Firebase Storage and returns its public URL.
 * This is a generic utility that can be used for any file type.
 *
 * @param file The file to upload.
 * @param path The destination path in the storage bucket (e.g., 'avatars/user123/profile.jpg').
 * @returns The public download URL of the uploaded file.
 */
export async function uploadFileToStorage(
  file: File,
  path: string
): Promise<string> {
  if (!file || !path) {
    throw new Error('File and path must be provided.');
  }

  // Create a storage reference
  const storageRef = ref(storage, path);

  // Upload the file
  const snapshot = await uploadBytes(storageRef, file);

  // Get the download URL
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
}
