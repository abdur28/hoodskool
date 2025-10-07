import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { UserProfile, UserRole } from '@/types/types';

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, displayName?: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    // Send email verification
    await sendEmailVerification(user);

    // Create user profile in Firestore with 'user' role by default
    await createUserProfile(user, 'email', 'user');

    // Create session cookie
    const idToken = await user.getIdToken();
    await createSession(idToken);

    return { user, error: null };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { user: null, error: error.message };
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create session cookie
    const idToken = await user.getIdToken();
    await createSession(idToken);

    return { user, error: null };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { user: null, error: error.message };
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user profile exists, if not create it
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await createUserProfile(user, 'google', 'user');
    }

    // Create session cookie
    const idToken = await user.getIdToken();
    await createSession(idToken);

    return { user, error: null };
  } catch (error: any) {
    console.error('Google sign in error:', error);
    return { user: null, error: error.message };
  }
}

/**
 * Sign out
 */
export async function signOut() {
  try {
    // Sign out from Firebase
    await firebaseSignOut(auth);
    
    // Clear session cookie
    await clearSession();
    
    return { error: null };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { error: error.message };
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    console.error('Password reset error:', error);
    return { error: error.message };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates: {
  displayName?: string;
  photoURL?: string;
  address?: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    // Update Firebase Auth profile
    if (updates.displayName || updates.photoURL) {
      await updateProfile(user, {
        displayName: updates.displayName,
        photoURL: updates.photoURL,
      });
    }

    // Update Firestore profile
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error: any) {
    console.error('Update profile error:', error);
    return { error: error.message };
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(userId: string, role: UserRole) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role,
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error: any) {
    console.error('Update role error:', error);
    return { error: error.message };
  }
}

/**
 * Create user profile in Firestore
 */
async function createUserProfile(
  user: User, 
  signInMethod: 'email' | 'google',
  role: UserRole = 'user'
) {
  const userProfile: Omit<UserProfile, 'createdAt' | 'updatedAt'> & {
    createdAt: any;
    updatedAt: any;
  } = {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName || undefined,
    photoURL: user.photoURL || undefined,
    role, // Default to 'user'
    signInMethod,
    emailVerified: user.emailVerified,
    orders: [],
    wishlistItems: [],
    emailOptIn: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'users', user.uid), userProfile);
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
}

/**
 * Create session cookie (call API route)
 */
async function createSession(idToken: string) {
  try {
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });
  } catch (error) {
    console.error('Create session error:', error);
  }
}

/**
 * Clear session cookie (call API route)
 */
async function clearSession() {
  try {
    await fetch('/api/auth/session', {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Clear session error:', error);
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get current user
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!auth.currentUser;
}