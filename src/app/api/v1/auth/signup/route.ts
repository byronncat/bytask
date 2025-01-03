import type { NextRequest } from 'next/server';
import type { SessionPayload } from 'api';

import { SignJWT } from 'jose';
import { UserModel } from '@/database';
import validator from '@/libraries/zod';
import { sendEmail } from '@/libraries/nodemailer';
import { password as passwordHelper, createVerifyEmail } from '@/helpers';
import { STATUS_CODE, ENCODED_KEY, SERVER_API } from '@/constants/serverConfig';
import { ACCOUNT_TYPE } from '@/constants/metadata';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json().catch(() => {
      throw 'Invalid request body!';
    });
    const result = validator.signup(data);

    if (result.success) {
      const { username, email, password } = data;

      const existingUser = await UserModel.findOne({ email });

      if (existingUser && existingUser.email === email)
        return new Response(JSON.stringify('Email already exists!'), {
          status: STATUS_CODE.BAD_REQUEST,
          headers: {
            'Content-Type': 'application/json',
          },
        });

      const user = await UserModel.create({
        username,
        email,
        password: await passwordHelper.hash(password),
        type: ACCOUNT_TYPE.CREDENTIALS,
      });

      const token = await new SignJWT({
        id: user.id,
        name: username,
        email,
        type: user.type,
      } as SessionPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('30m')
        .sign(ENCODED_KEY);

      await sendEmail({
        to: email,
        subject: 'Verify your email',
        text: 'Please verify your email',
        html: createVerifyEmail({
          username,
          verificationLink: `${SERVER_API}/v1/auth/verify?token=${token}`,
        }),
      });

      return new Response(
        JSON.stringify('User created! Check your email to verify for login.'),
        {
          status: STATUS_CODE.CREATED,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } else {
      return new Response(JSON.stringify(result.error.issues[0].message), {
        status: STATUS_CODE.BAD_REQUEST,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
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
