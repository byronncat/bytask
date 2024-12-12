import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import type { SessionPayload } from 'api';
// import 'colors';

const secretKey = process.env.SESSION_SECRET || 'secret';
const encodedKey = new TextEncoder().encode(secretKey);

async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt.getTime())
    .sign(encodedKey);
}

async function decrypt(session: string | undefined = '') {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

const expiresDays = 7 * 24 * 60 * 60 * 1000; // 7 days
async function create(userId: string) {
  try {
    const expiresAt = new Date(Date.now() + expiresDays);

    const session = await encrypt({
      userId,
      expiresAt,
    });

    const cookieStore = await cookies();
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresDays / 1000,
      sameSite: 'lax',
      path: '/',
    });
  } catch (error) {
    console.error('[Session]', '- Failed to create session', error);
    throw 'Failed to create session';
  }
}

export async function discard() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session');
  } catch (error) {
    console.error('[Session]', '- Failed to delete session', error);
    throw 'Failed to delete session';
  }
}

const session = {
  create,
  discard,
  decrypt,
};

export default session;
