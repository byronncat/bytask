'use client';

import type { IApi } from 'api';
import type { LoginFormData, SignupFormData } from '@/constants/form';

const serverHost = process.env.NEXT_PUBLIC_DOMAIN;
if (!serverHost) throw Error('Server Host is not defined');

const apiUrl = {
  login: `${serverHost}/v1/auth/login`,
  signup: `${serverHost}/v1/auth/signup`,
};

export async function login({
  identity,
  password,
}: LoginFormData): Promise<IApi> {
  console.log(apiUrl.login);
  return await fetch(apiUrl.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identity, password }),
  })
    .then(async (res) => {
      const message = await res.json();
      if (!res.ok) throw Error(message);
      return {
        success: true,
        message,
      };
    })
    .catch((error) => {
      console.error(error);
      return {
        success: false,
        message: error,
      };
    });
}

export async function signup(data: SignupFormData): Promise<IApi> {
  return await fetch(apiUrl.signup, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const message = await res.json();
      if (!res.ok) throw Error(message);
      return {
        success: true,
        message,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}
