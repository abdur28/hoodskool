// lib/firebaseAdmin.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Load environment variables
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY ? 
                  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : 
                  undefined;
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

// Initialize Firebase Admin
const adminApps = getApps();

const firebaseAdminApp = !adminApps.length
  ? initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket,
    })
  : adminApps[0];

// Get services
export const adminAuth = getAuth(firebaseAdminApp);
export const adminDb = getFirestore(firebaseAdminApp);
export const adminStorage = getStorage(firebaseAdminApp);