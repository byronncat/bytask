import session from '@/libraries/session';
import { STATUS_CODE } from '@/constants/serverConfig';

export async function DELETE() {
  try {
    return await session
      .clear()
      .then(
        () =>
          new Response(JSON.stringify('Logout successful!'), {
            status: STATUS_CODE.OK,
            headers: {
              'Content-Type': 'application/json',
            },
          }),
      )
      .catch(
        () =>
          new Response(JSON.stringify('User not logged in!'), {
            status: STATUS_CODE.NOT_FOUND,
            headers: {
              'Content-Type': 'application/json',
            },
          }),
      );
  } catch (error) {
    const message = typeof error === 'string' ? error : 'Internal server error';
    console.error('[Error]:', message);
    return new Response(JSON.stringify(message), {
      status: STATUS_CODE.INTERNAL_SERVER_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
