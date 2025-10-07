import { cookies } from 'next/headers';
import { adminAuth, adminDb } from './admin';
import { SessionUser } from '@/types/types';

const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION = 60 * 60 * 24 * 7 * 1000; // 7 days

/**
 * Create session cookie from ID token
 */
export async function createSessionCookie(idToken: string): Promise<string> {
  try {
    // Create session cookie with 7 days expiration
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION,
    });

    return sessionCookie;
  } catch (error) {
    console.error('Create session cookie error:', error);
    throw new Error('Failed to create session cookie');
  }
}

/**
 * Set session cookie in response
 */
export async function setSessionCookie(sessionCookie: string) {
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: '/',
  });
}

/**
 * Get session user from cookie
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    // Verify session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie.value,
      true
    );

    // Get user profile from Firestore to get role
    const userDoc = await adminDb.collection('users').doc(decodedClaims.uid).get();
    
    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data();

    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email!,
      displayName: userData?.displayName,
      photoURL: userData?.photoURL,
      role: userData?.role || 'user',
      emailVerified: decodedClaims.email_verified || false,
    };
  } catch (error) {
    console.error('Get session user error:', error);
    return null;
  }
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getSessionUser();
  return !!user;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  return user?.role === 'admin';
}

/**
 * Require authentication (throw error if not authenticated)
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

/**
 * Require admin role (throw error if not admin)
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return user;
}