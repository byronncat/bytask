'use client';

import type { Api } from 'api';
import type { LoginFormData, SignupFormData } from '@/constants/form';
import { User } from 'schema';

const serverHost = process.env.NEXT_PUBLIC_DOMAIN;
if (!serverHost) throw Error('Server Host is not defined');

const apiUrl = {
  login: `${serverHost}/v1/auth/login`,
  signup: `${serverHost}/v1/auth/signup`,
  logout: `${serverHost}/v1/auth/logout`,
  authenticate: `${serverHost}/v1/auth/authenticate`,
};

export async function login(data: LoginFormData): Promise<Api> {
  return await fetch(apiUrl.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const response = (await res.json()) as Api['message'];
      if (!res.ok) throw response;
      return {
        success: true,
        message: response,
      };
    })
    .catch((error: string) => {
      return {
        success: false,
        message: error,
      };
    });
}

export async function signup(data: SignupFormData): Promise<Api> {
  return await fetch(apiUrl.signup, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const response = (await res.json()) as Api['message'];
      if (!res.ok) throw response;
      return {
        success: true,
        message: response,
      };
    })
    .catch((error: string) => {
      return {
        success: false,
        message: error,
      };
    });
}

export async function logout(): Promise<Api> {
  return await fetch(apiUrl.logout, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(async (res) => {
      const response = (await res.json()) as Api['message'];
      if (!res.ok) throw response;
      return {
        success: true,
        message: response,
      };
    })
    .catch((error: string) => {
      return {
        success: false,
        message: error,
      };
    });
}

export async function authenticate(): Promise<Api<User>> {
  return await fetch(apiUrl.authenticate, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(async (res) => {
      const reponse = await res.json();
      if (!res.ok) throw reponse as Api['message'];
      return {
        success: true,
        message: 'User authenticated',
        data: reponse as User,
      };
    })
    .catch(async (error: string) => {
      return {
        success: false,
        message: error,
      };
    });
}
