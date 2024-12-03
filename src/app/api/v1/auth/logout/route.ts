import session from '@/libraries/session';
import { STATUS_CODE } from '@/constants/server';

export async function DELETE(request: Request) {
  try {
    return await session
      .discard()
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
    console.error('[Error]:', error);
    const errorMessage =
      typeof error === 'string' ? error : 'Internal server error';
    return new Response(errorMessage, {
      status: STATUS_CODE.INTERNAL_SERVER_ERROR,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
