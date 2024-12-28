import type { NextRequest } from 'next/server';
import type { ChangeProfileFormData } from '@/constants/form';

import { UserModel } from '@/database';
import { password as passwordHelper } from '@/helpers';
import { ENCODED_KEY, STATUS_CODE } from '@/constants/serverConfig';
import { jwtVerify } from 'jose';

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');

    const data = (await request.json().catch(() => {
      throw 'Invalid request body!';
    })) as ChangeProfileFormData;

    const bearerToken = request.headers.get('Authorization');
    if (!bearerToken) {
      return new Response(JSON.stringify('Unauthorized!'), {
        status: STATUS_CODE.UNAUTHORIZED,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const token = bearerToken.split(' ')[1];
    const { payload } = await jwtVerify(token, ENCODED_KEY, {
      algorithms: ['HS256'],
    }).catch(() => {
      throw 'Unauthorized!';
    });

    const user = await UserModel.findById(payload.uid);
    if (!user) {
      return new Response(JSON.stringify('User not found!'), {
        status: STATUS_CODE.NOT_FOUND,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (!(type === 'reset-password') && data.currentPassword) {
      if (data.currentPassword === data.newPassword)
        return new Response(
          JSON.stringify('New password must differ from the current password!'),
          {
            status: STATUS_CODE.BAD_REQUEST,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      if (!(await passwordHelper.compare(data.currentPassword, user.password)))
        return new Response(JSON.stringify('Incorrect password!'), {
          status: STATUS_CODE.UNAUTHORIZED,
          headers: {
            'Content-Type': 'application/json',
          },
        });
    }

    if (data.username) user.username = data.username;

    if (data.newPassword)
      user.password = await passwordHelper.hash(data.newPassword!);
    await user.save();

    if (type === 'reset-password') {
      return new Response(JSON.stringify('Password updated!'), {
        status: STATUS_CODE.OK,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
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
