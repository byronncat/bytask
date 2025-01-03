import type { Api, SessionPayload } from 'api';
import type { User } from 'schema';

import { SignJWT } from 'jose';
import { createVerifyEmail, password as passwordHelper } from '@/helpers';
import { UserModel } from '@/database';
import validator from '@/libraries/zod';
import { sendEmail } from '@/libraries/nodemailer';
import { ACCOUNT_TYPE } from '@/constants/metadata';
import { ENCODED_KEY, SERVER_API } from '@/constants/serverConfig';

interface LoginData {
  email: User['email'] | null;
  username: User['username'] | null;
  password: User['password'] | null;
}

type Credentials = Partial<Pick<LoginData, 'email' | 'password'>>;
type Google = Partial<Pick<LoginData, 'email' | 'username'>>;

async function credentialsLogin({
  email,
  password,
}: Credentials): Promise<Api<SessionPayload>> {
  const result = validator.login({
    identity: email,
    password,
  });
  if (result.success) {
    const user = (await UserModel.findOne({
      email,
      password: { $exists: true },
    })) as User;

    if (!user) {
      return {
        success: false,
        message: 'User not found.',
      };
    }

    if (!user.verified) {
      const token = await new SignJWT({
        name: user.username,
        email: user.email,
        id: user.id,
      } as SessionPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('30m')
        .sign(ENCODED_KEY);

      await sendEmail({
        to: user.email,
        subject: 'Verify your email',
        text: `Click the link to verify your email`,
        html: createVerifyEmail({
          username: user.username,
          verificationLink: `${SERVER_API}/v1/auth/verify?token=${token}`,
        }),
      });
      return {
        success: false,
        message: 'User not verified. Please check your email.',
      };
    }

    if (!(await passwordHelper.compare(password!, user.password))) {
      return {
        success: false,
        message: 'Incorrect password.',
      };
    }

    const sessionPayload: SessionPayload = {
      id: user.id,
      name: user.username,
      email: user.email,
      type: ACCOUNT_TYPE.CREDENTIALS,
    };
    return {
      success: true,
      message: 'Login successful',
      data: sessionPayload,
    };
  }
  return {
    success: true,
    message: result.error.issues[0].message,
  };
}

async function googleLogin({
  email,
  username,
}: Google): Promise<Api<SessionPayload>> {
  if (!email || !username) {
    return {
      success: false,
      message: 'Email and username are required.',
    };
  }

  const sessionPayload: SessionPayload = {
    id: '',
    name: username,
    email,
    type: ACCOUNT_TYPE.GOOGLE,
  };

  const existingUser = await UserModel.findOne({ email });
  if (!existingUser) {
    const user = await UserModel.create({
      email,
      username,
      verified: true,
      type: ACCOUNT_TYPE.GOOGLE,
    });

    sessionPayload.id = user.id;
    return {
      success: true,
      message: 'Login successful',
      data: sessionPayload,
    };
  }

  sessionPayload.id = existingUser.id;
  return {
    success: true,
    message: 'Login successful',
    data: sessionPayload,
  };
}

export async function login(
  provider: 'credentials' | 'google',
  credentials: Credentials | Google,
): Promise<Api<SessionPayload>> {
  switch (provider) {
    case 'credentials':
      return credentialsLogin(credentials as Credentials);
    case 'google':
      return googleLogin(credentials as Google);
    default:
      return {
        success: false,
        message: 'Invalid provider',
      };
  }
}
