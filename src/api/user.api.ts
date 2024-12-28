import type { Api } from 'api';
import type { User } from 'schema';

import { SERVER_API, ENCODED_KEY } from '@/constants/serverConfig';
import { SignJWT } from 'jose';

const apiUrl = {
  updateAccount: `${SERVER_API}/v1/users`,
};

export async function updateAccount(
  userID: User['id'],
  data: Partial<User>,
): Promise<Api<Pick<User, 'username'>>> {
  const token = await new SignJWT({ uid: userID })
    .setProtectedHeader({
      alg: 'HS256',
    })
    .setExpirationTime('5m')
    .sign(ENCODED_KEY);

  return await fetch(apiUrl.updateAccount, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw data as Api['message'];
      return {
        success: true,
        message: 'Account updated successfully',
        data: data as Pick<User, 'username'>,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}
