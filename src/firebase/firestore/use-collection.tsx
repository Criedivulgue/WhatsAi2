'use client';

import {
  onSnapshot,
  type Query,
  type DocumentData,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T extends DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setData([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(items);
        setLoading(false);
      },
      (serverError) => {
        const permissionError = new FirestorePermissionError({
          // @ts-ignore TODO: Fix this type
          path: query._query.path.segments.join('/'),
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setData([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading };
}