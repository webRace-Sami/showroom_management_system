import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest, signJwt, AUTH_COOKIE_NAME } from '@/lib/auth';
import store from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthFromRequest(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newUsername, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json({ error: 'Current password is required to verify identity.' }, { status: 400 });
    }

    const result = await store.updateAdminCredentials(
      auth.username,
      currentPassword,
      newUsername,
      newPassword
    );

    // Refresh JWT session cookie with updated details
    const newToken = signJwt({
      userId: result.user.id,
      username: result.user.username,
      fullName: result.user.fullName,
      role: result.user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Admin credentials updated successfully.',
      user: result.user,
    });

    response.cookies.set(AUTH_COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update credentials' }, { status: 400 });
  }
}
