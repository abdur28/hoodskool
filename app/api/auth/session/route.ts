import { NextRequest, NextResponse } from 'next/server';
import { createSessionCookie, setSessionCookie, clearSessionCookie } from '@/lib/firebase/session';

/**
 * POST /api/auth/session
 * Create session cookie from ID token
 */
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }

    // Create session cookie
    const sessionCookie = await createSessionCookie(idToken);
    
    // Set cookie in response
    await setSessionCookie(sessionCookie);

    return NextResponse.json(
      { success: true, message: 'Session created' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create session' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth/session
 * Clear session cookie (logout)
 */
export async function DELETE(request: NextRequest) {
  try {
    await clearSessionCookie();

    return NextResponse.json(
      { success: true, message: 'Session cleared' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Session deletion error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to clear session' },
      { status: 500 }
    );
  }
}