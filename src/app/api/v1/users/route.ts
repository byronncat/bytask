import type { NextRequest } from 'next/server';
import type { ChangeProfileFormData } from '@/constants/form';

import { authAction_v2 } from '@/api';
import { UserModel } from '@/database';
import { STATUS_CODE } from '@/constants/serverConfig';

export async function PUT(request: NextRequest) {
  try {
    const data = (await request.json().catch(() => {
      throw 'Invalid request body!';
    })) as ChangeProfileFormData;

    const sessionPayload = (await authAction_v2.authenticate()).user;
    if (!sessionPayload) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: STATUS_CODE.UNAUTHORIZED,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const user = await UserModel.findById(sessionPayload.id);
    if (!user) {
      return new Response(JSON.stringify('User not found!'), {
        status: STATUS_CODE.NOT_FOUND,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (data.username) user.username = data.username;
    await user.save();

    return new Response(
      JSON.stringify({
        username: user.username,
      }),
      {
        status: STATUS_CODE.OK,
        headers: {
          'Content-Type': 'application/json',
        },
      },
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
