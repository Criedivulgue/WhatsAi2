'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { doc } from 'firebase/firestore';
// Use the fundamental auth state hook, not the composed useUser hook
import { useAuthState, useFirestore, useDoc } from '@/firebase'; 
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

// Defines the shape of the context value
interface UserProfileContextType {
  user: ComposedUserProfile | null; // The rich, composed user profile
  auth: FirebaseUser | null; // The raw Firebase Auth user object
  loading: boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

/**
 * This provider orchestrates the data from Auth, /users, and /brands collections
 * to provide a single, consistent user profile object for the entire app.
 */
export function UserProfileProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  // 1. Get the basic authentication user from Firebase Auth.
  const { user: authUser, loading: authLoading } = useAuthState();

  // 2. Create a memoized reference to the user document in Firestore.
  const userDocRef = useMemo(() => 
    authUser ? doc(firestore, 'users', authUser.uid).withConverter(userConverter) : null,
    [authUser, firestore]
  );
  const [userDoc, userLoading] = useDoc(userDocRef);
  const userData = userDoc?.data();

  // 3. Create a memoized reference to the brand document, based on the user data.
  const brandDocRef = useMemo(() => 
    userData?.brandId ? doc(firestore, 'brands', userData.brandId).withConverter(brandConverter) : null,
    [userData, firestore]
  );
  const [brandDoc, brandLoading] = useDoc(brandDocRef);
  const brandData = brandDoc?.data();

  const loading = authLoading || userLoading || brandLoading;

  // 4. Compose the final user profile object.
  const composedUser: ComposedUserProfile | null = useMemo(() => {
    if (authUser && userData && brandData) {
      return {
        ...userData,
        ...brandData,
        uid: authUser.uid, // Ensure auth UID is definitive
        email: authUser.email, // Ensure auth email is definitive
      };
    }
    return null;
  }, [authUser, userData, brandData]);

  // 5. Provide the correct context value, matching the UserProfileContextType.
  const value = {
    user: composedUser, // The composed profile
    // Ensure `auth` is `null` instead of `undefined` during initialization
    auth: authUser ?? null, // The raw auth user
    loading,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

/**
 * Hook to access the complete, composed user profile and auth state.
 */
export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
