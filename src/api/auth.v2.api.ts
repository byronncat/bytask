'use server';

import type { Session } from 'next-auth';
import type { Api, SessionPayload } from 'api';
import type { LoginFormData } from '@/constants/form';

import { AuthError } from 'next-auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { auth, signIn, signOut } from '@/libraries/auth';
import { ROUTE } from '@/constants/serverConfig';

export async function login(data: LoginFormData): Promise<Api> {
  try {
    await signIn('credentials', {
      identity: data.identity,
      password: data.password,
      redirectTo: ROUTE.DASHBOARD,
    });
    return {
      success: true,
      message: 'Login successful.',
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof AuthError && error.cause?.err instanceof Error) {
      return {
        success: false,
        message: error.cause.err.message,
      };
    }
    return {
      success: false,
      message: 'Internal server error.',
    };
  }
}

export async function logout() {
  return await signOut();
}

type CustomSession = Session & {
  user: SessionPayload;
};
export async function authenticate() {
  return (await auth()) as CustomSession;
}

export async function googleLogin() {
  await signIn('google');
}
