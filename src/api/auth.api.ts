'use client';

import type { IApi } from 'api';
import type { LoginFormData, SignupFormData } from '@/constants/form';
import { IUser } from 'schema';

const serverHost = process.env.NEXT_PUBLIC_DOMAIN;
if (!serverHost) throw Error('Server Host is not defined');

const apiUrl = {
  login: `${serverHost}/v1/auth/login`,
  signup: `${serverHost}/v1/auth/signup`,
  logout: `${serverHost}/v1/auth/logout`,
  authenticate: `${serverHost}/v1/auth/authenticate`,
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

export async function logout(): Promise<IApi> {
  return await fetch(apiUrl.logout, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
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

export async function authenticate(): Promise<IApi<IUser>> {
  return await fetch(apiUrl.authenticate, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw Error(data);
      return {
        success: true,
        message: 'User authenticated',
        data,
      };
    })
    .catch(async (error) => {
      return {
        success: false,
        message: error,
      };
    });
}
