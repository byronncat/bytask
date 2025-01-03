import type { NextRequest } from 'next/server';
import type {
  ChangePasswordFormData,
  SetNewPasswordFormData,
} from '@/constants/form';

import { authAction_v2 } from '@/api';
import { UserModel } from '@/database';
import { password as passwordHelper } from '@/helpers';
import validator from '@/libraries/zod';
import { STATUS_CODE } from '@/constants/serverConfig';

export async function PUT(request: NextRequest) {
  try {
    const data = (await request.json().catch(() => {
      throw 'Invalid request body!';
    })) as ChangePasswordFormData | SetNewPasswordFormData;

    const result = validator.changePassword(data);
    if (result.success) {
      const sessionPayload = await authAction_v2.authenticate();
      if (!sessionPayload) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), {
          status: STATUS_CODE.UNAUTHORIZED,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      const user = await UserModel.findById(sessionPayload.user.id);
      if (!user) {
        return new Response(JSON.stringify('User not found!'), {
          status: STATUS_CODE.NOT_FOUND,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      if ('currentPassword' in data) {
        if (data.currentPassword === data.newPassword)
          return new Response(
            JSON.stringify(
              'New password must differ from the current password!',
            ),
            {
              status: STATUS_CODE.BAD_REQUEST,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

        if (
          !(await passwordHelper.compare(data.currentPassword, user.password))
        )
          return new Response(JSON.stringify('Incorrect password!'), {
            status: STATUS_CODE.UNAUTHORIZED,
            headers: {
              'Content-Type': 'application/json',
            },
          });
      }

      user.password = await passwordHelper.hash(data.newPassword!);
      await user.save();

      return new Response(JSON.stringify('Password updated!'), {
        status: STATUS_CODE.OK,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else
      return new Response(JSON.stringify(result.error.issues[0].message), {
        status: STATUS_CODE.BAD_REQUEST,
        headers: {
          'Content-Type': 'application/json',
        },
      });
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
