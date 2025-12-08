'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

// This is a client-side component that listens for permission errors
// and throws them to the Next.js error overlay. This is useful for
// debugging security rules in development.
//
// NOTE: This component should only be used in development.
function FirebaseErrorListener() {
  useEffect(() => {
    const handler = (error: any) => {
      // Throw the error so that Next.js's error overlay shows it
      throw error;
    };
    errorEmitter.on('permission-error', handler);
    return () => {
      errorEmitter.off('permission-error', handler);
    };
  }, []);

  return null;
}

export default process.env.NODE_ENV === 'development'
  ? FirebaseErrorListener
  : () => null;
