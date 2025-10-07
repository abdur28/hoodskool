import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth } from '@/lib/firebase/admin';
import { UserRole } from '@/types/types';

const COOKIE_NAME = 'auth-token';

interface AuthUser {
  uid: string;
  email: string | undefined;
  role: UserRole;
}

/**
 * Get current authenticated user in Server Component
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return null;
    }

    // Verify session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      role: (decodedClaims.role as UserRole) || 'user',
    };
  } catch (error) {
    // Invalid or expired session
    return null;
  }
}

/**
 * Require authentication in Server Component
 * Redirects to login if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return user;
}

/**
 * Require admin role in Server Component
 * Redirects to home if not admin
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();

  if (user.role !== 'admin') {
    redirect('/');
  }

  return user;
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}