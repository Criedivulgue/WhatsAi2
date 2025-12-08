'use client';

import {
  ref,
  uploadBytes,
  getDownloadURL,
  type FirebaseStorage,
} from 'firebase/storage';

/**
 * Uploads an avatar image to Firebase Storage.
 * @param storage The Firebase Storage instance.
 * @param userId The ID of the user uploading the avatar.
 * @param file The image file to upload.
 * @param path The storage path (e.g., 'avatars').
 * @returns The public download URL of the uploaded image.
 */
export async function uploadAvatar(
  storage: FirebaseStorage,
  userId: string,
  file: File,
  path: string = 'avatars'
): Promise<string> {
  // Create a storage reference with a unique name
  const storageRef = ref(storage, `${path}/${userId}/${file.name}`);

  // Upload the file
  const snapshot = await uploadBytes(storageRef, file);

  // Get the download URL
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
}
