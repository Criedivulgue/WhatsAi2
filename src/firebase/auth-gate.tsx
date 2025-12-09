'use client';

import { useUser, useFirestore, useDoc } from '.';
import { Loader2 } from 'lucide-react';
import { type PropsWithChildren, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { doc } from 'firebase/firestore';

/**
 * This component is the definitive gatekeeper for the application.
 * 1. It prevents hydration errors by waiting for Firebase auth to be ready.
 * 2. It enforces the onboarding flow by checking for a user's profile document in Firestore.
 * - If a user is authenticated but has no profile, it redirects to /onboarding.
 * - If a user is authenticated and has a profile, it allows access to the app.
 */
export function AuthGate({ children }: PropsWithChildren) {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  // Create a document reference to the user's profile, only if the user is loaded.
  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  // Correctly destructure the array returned by the useDoc hook.
  const [userDoc, userDocLoading] = useDoc(userDocRef);

  const isLoading = userLoading || (!!user && userDocLoading);

  useEffect(() => {
    if (isLoading) return; // Wait until all loading is done

    const isAuthPage = pathname === '/';
    const isOnboardingPage = pathname === '/onboarding';
    const isClientChatPage = pathname.startsWith('/client-chat');
    const userProfileExists = userDoc?.exists();

    if (user) {
      // User is authenticated
      if (!userProfileExists && !isOnboardingPage) {
        // No profile? Force onboarding.
        router.push('/onboarding');
      } else if (userProfileExists && (isOnboardingPage || isAuthPage)) {
        // Profile exists? Go to the dashboard from onboarding or login page.
        router.push('/dashboard');
      }
    } else {
      // User is not authenticated
      // If the user is not on any allowed public page, redirect them to the login page.
      if (!isAuthPage && !isOnboardingPage && !isClientChatPage) {
        router.push('/');
      }
    }
  }, [user, userDoc, isLoading, pathname, router]);

  // This condition is crucial. It shows a loader under two circumstances:
  // 1. `isLoading` is true: We are actively fetching the user's auth state or profile.
  // 2. `!user && !isPublicPage`: The user is not logged in and is trying to access a protected page.
  // This second condition is a "pre-emptive" loader. It prevents the protected `children`
  // from flashing on the screen for a brief moment before the `useEffect` hook can redirect the user.
  const isPublicPage = pathname === '/' || pathname === '/onboarding' || pathname.startsWith('/client-chat');
  if (isLoading || (!user && !isPublicPage)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
