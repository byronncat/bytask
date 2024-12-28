import { cookies } from 'next/headers';
import { UserModel } from '@/database';
import session from '@/libraries/session';
import type { SessionPayload } from 'api';

export async function getUser() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('session')?.value;
  const sessionData = (await session.decrypt(cookie)) as SessionPayload;

  if (!sessionData?.id) {
    await session.clear();
    return undefined;
  }

  const user = await UserModel.findById(sessionData.id);
  if (!user) {
    await session.clear();
    return undefined;
  }

  return user;
}
