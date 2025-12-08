
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Define interfaces for the data shapes for type safety
interface BrandData {
  id: string;
  brandName: string;
  slogan?: string;
  // Include other fields from your Brand type if needed
}

interface UserData {
  uid: string;
  avatarUrl?: string;
  brandId?: string;
  // Include other fields from your User type if needed
}

// Initialize Firebase Admin SDK. This should only run once.
// It's safe to run this code in a module that will be imported in Server Components.
// We assume the service account key is stored in a JSON string in an environment variable.
if (!getApps().length) {
  try {
    // Make sure the environment variable is set in your deployment environment.
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
    initializeApp({
      credential: cert(serviceAccount)
    });
  } catch (error) {
    console.error('Firebase Admin initialization error. Ensure FIREBASE_SERVICE_ACCOUNT_KEY env variable is set correctly.', error);
  }
}

const db = getFirestore();

/**
 * Fetches brand and associated user data from Firestore for server-side rendering.
 * This is used to generate dynamic metadata for SEO and social sharing.
 * @param brandId The ID of the brand to fetch.
 * @returns An object containing brandData and userData, or null if not found.
 */
export async function getBrandAndUserData(brandId: string): Promise<{ brandData: BrandData | null; userData: UserData | null; }> {
  if (!brandId) {
    return { brandData: null, userData: null };
  }

  try {
    // 1. Fetch the brand document
    const brandDocRef = db.collection('brands').doc(brandId);
    const brandSnap = await brandDocRef.get();
    
    if (!brandSnap.exists) {
      console.log(`No brand found for ID: ${brandId}`);
      return { brandData: null, userData: null };
    }
    // Manually construct the object, similar to what a converter would do
    const brandData = { id: brandSnap.id, ...brandSnap.data() } as BrandData;

    // 2. Query for the user document that contains this brandId
    const usersCollectionRef = db.collection('users');
    const userQuery = usersCollectionRef.where('brandId', '==', brandId).limit(1);
    const userSnap = await userQuery.get();
    
    if (userSnap.empty) {
      console.warn(`No user found associated with brandId: ${brandId}`);
      // It's possible a brand exists without a user, so we return what we have.
      return { brandData, userData: null };
    }

    const userDoc = userSnap.docs[0];
    const userData = { uid: userDoc.id, ...userDoc.data() } as UserData;

    return { brandData, userData };

  } catch (error) {
    console.error(`Server-side Firestore error fetching data for brandId ${brandId}:`, error);
    // Return null on error to allow the caller to handle it gracefully
    return { brandData: null, userData: null };
  }
}
