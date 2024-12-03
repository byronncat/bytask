import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { v4 as uuidv4 } from 'uuid';
import { redis } from '@/database';
import type { SessionPayload } from 'api';
import 'colors';

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
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('[JWT]:'.red, '- Failed to verify session', error);
    throw 'Failed to verify session';
  }
}

const expiresDays = 7 * 24 * 60 * 60 * 1000; // 7 days
async function create(userId: string) {
  try {
    const expiresAt = new Date(Date.now() + expiresDays);
    const sessionId = uuidv4();

    await redis.set(sessionId, userId, {
      PX: expiresDays,
    });

    const session = await encrypt({
      id: sessionId,
      userId,
      expiresAt,
    });

    const cookieStore = await cookies();
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresDays / 1000,
      // sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
      sameSite: 'none',
      path: '/',
    });
  } catch (error) {
    console.error('[Session]'.red, '- Failed to create session', error);
    throw 'Failed to create session';
  }
}

export async function discard() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) return;
    const { id } = (await decrypt(session)) as SessionPayload;
    await redis.del(id);

    cookieStore.delete('session');
  } catch (error) {
    console.error('[Session]'.red, '- Failed to delete session', error);
    throw 'Failed to delete session';
  }
}

const session = {
  create,
  discard,
  decrypt,
};

export default session;
