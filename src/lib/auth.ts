import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-luxury-showroom-secret-key-2026';
export const AUTH_COOKIE_NAME = 'showroom_admin_session';

export interface TokenPayload {
  userId: string;
  username: string;
  fullName: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function signJwt(payload: { userId: string; username: string; fullName: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJwt(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function comparePassword(plainText: string, hashed: string): Promise<boolean> {
  // If hash matches bcrypt format
  if (hashed.startsWith('$2a$') || hashed.startsWith('$2b$')) {
    return bcrypt.compare(plainText, hashed);
  }
  // Plaintext match fallback for simple testing
  return plainText === hashed;
}

export function getAuthFromRequest(req: NextRequest): TokenPayload | null {
  const cookieToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (cookieToken) {
    const payload = verifyJwt(cookieToken);
    if (payload) return payload;
  }

  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return verifyJwt(token);
  }

  return null;
}
