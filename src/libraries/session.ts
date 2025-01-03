import type { SessionPayload } from 'api';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { ENCODED_KEY } from '@/constants/serverConfig';

type JWTSessionPayload = {
  id: SessionPayload['id'];
  expiresAt: Date;
};

async function encrypt(payload: JWTSessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt.getTime())
    .sign(ENCODED_KEY);
}

async function decrypt(session: string | undefined = '') {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, ENCODED_KEY, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('[Session]', '- Failed to decrypt session', error);
    return null;
  }
}

const expiresDays = 7 * 24 * 60 * 60 * 1000; // 7 days
async function create(userId: string) {
  try {
    const expiresAt = new Date(Date.now() + expiresDays);

    const session = await encrypt({
      id: userId,
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

export async function clear() {
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
  clear,
  decrypt,
};

export default session;
