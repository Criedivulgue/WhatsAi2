'use client';

import { FirebaseProvider, type FirebaseContextValue } from './provider';
import { PropsWithChildren, useMemo } from 'react';
import { initializeFirebase } from '.';

export function FirebaseClientProvider({ children }: PropsWithChildren) {
  const firebase = useMemo(() => initializeFirebase(), []);
  return <FirebaseProvider value={firebase}>{children}</FirebaseProvider>;
}
