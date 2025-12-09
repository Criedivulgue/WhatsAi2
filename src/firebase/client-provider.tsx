'use client';

import { FirebaseProvider, type FirebaseContextValue } from './provider';
import { PropsWithChildren, useMemo } from 'react';
// CORRECT: Import the individual instances directly from the main index file.
import { firebaseApp, auth, firestore, storage } from '.';

export function FirebaseClientProvider({ children }: PropsWithChildren) {
  // The value for the provider is now an object composed of the imported instances.
  // This avoids calling the removed `initializeFirebase` function.
  const firebaseContextValue: FirebaseContextValue = useMemo(() => ({
    // CORRECTED: The property name must be `firebaseApp` to match the FirebaseContextValue interface.
    firebaseApp,
    auth,
    firestore,
    storage,
  }), []);

  return <FirebaseProvider value={firebaseContextValue}>{children}</FirebaseProvider>;
}
