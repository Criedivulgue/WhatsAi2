'use client';

import { createContext, useContext, ReactNode } from 'react';
import { doc } from 'firebase/firestore';
import { useUser as useAuthUser, useFirestore, useDoc } from '@/firebase';
import { userConverter, brandConverter } from '@/firebase/converters';
import type { User, Brand } from '@/lib/types';
import { type User as FirebaseUser } from 'firebase/auth';

// The fully composed user profile, combining auth, user doc, and brand doc.
export interface ComposedUserProfile extends User, Brand {
  // from Firebase Auth
  email: string | null;
  // Explicitly add uid as it comes from auth
  uid: string;
}

interface UserProfileContextType {
  user: ComposedUserProfile | null;
  auth: FirebaseUser | null;
  loading: boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

/**
 * This provider orchestrates the data from Auth, /users, and /brands collections
 * to provide a single, consistent user profile object for the entire app.
 */
export function UserProfileProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const { user: authUser, loading: authLoading } = useAuthUser();

  // 1. Fetch the simple User document (/users/{uid})
  const userDocRef = authUser ? doc(firestore, 'users', authUser.uid).withConverter(userConverter) : null;
  // Correctly destructure the array returned by the useDoc hook
  const [userSnapshot, userDocLoading] = useDoc(userDocRef);
  const userData = userSnapshot?.data();

  // 2. Based on the user doc, fetch the corresponding Brand document (/brands/{brandId})
  const brandDocRef = userData?.brandId
    ? doc(firestore, 'brands', userData.brandId).withConverter(brandConverter)
    : null;
  // Correctly destructure the array returned by the useDoc hook
  const [brandSnapshot, brandDocLoading] = useDoc(brandDocRef);
  const brandData = brandSnapshot?.data();

  const loading = authLoading || userDocLoading || brandDocLoading;

  let composedUser: ComposedUserProfile | null = null;
  if (authUser && userData && brandData) {
    composedUser = {
      ...authUser, 
      ...userData, 
      ...brandData,
    };
  }

  const value = {
    user: composedUser,
    // Ensure auth is null, not undefined, to match the context type
    auth: authUser ?? null,
    loading,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

/**
 * Hook to access the complete, composed user profile.
 */
export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
