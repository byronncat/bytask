import type { NextRequest } from 'next/server';

import { SignJWT } from 'jose';
import { UserModel } from '@/database';
import { ENCODED_KEY, HOST_URL, STATUS_CODE } from '@/constants/serverConfig';
import { User } from 'schema';
import { sendEmail } from '@/libraries/nodemailer';
import { createResetPasswordEmail } from '@/helpers';

export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as Pick<User, 'email'>;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify('User not found!'), {
        status: STATUS_CODE.NOT_FOUND,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const token = await new SignJWT({
      uid: user.id,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30m')
      .sign(ENCODED_KEY);

    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      text: `Click the link to reset your password`,
      html: createResetPasswordEmail({
        username: user.username,
        resetLink: `${HOST_URL}/reset-password?token=${token}`,
      }),
    });

    return new Response(JSON.stringify('Email sent!'), {
      status: STATUS_CODE.OK,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[Error]:', error);
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
