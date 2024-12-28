'use client';

import type { Api } from 'api';
import type { User } from 'schema';
import type { LoginFormData, SignupFormData } from '@/constants/form';
import { SERVER_API } from '@/constants/serverConfig';

const apiUrl = {
  login: `${SERVER_API}/v1/auth/login`,
  signup: `${SERVER_API}/v1/auth/signup`,
  logout: `${SERVER_API}/v1/auth/logout`,
  authenticate: `${SERVER_API}/v1/auth/authenticate`,
  forgotPassword: `${SERVER_API}/v1/auth/forgot-password`,
  resetPassword: `${SERVER_API}/v1/users?type=reset-password`,
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

export async function forgotPassword(email: User['email']): Promise<Api> {
  return await fetch(apiUrl.forgotPassword, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
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

export async function resetPassword(
  token: string,
  password: string,
): Promise<Api> {
  return await fetch(apiUrl.resetPassword, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword: password }),
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
