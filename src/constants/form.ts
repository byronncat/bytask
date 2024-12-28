import type { IForm, FormData } from 'form';
import type { User } from 'schema';

export const LOGIN_FORM = {
  fields: [
    {
      id: 'identity',
      label: 'Email',
      placeholder: '',
      type: 'email',
      validation: {
        required: 'Email is required',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
          message: 'Email is invalid',
        },
      },
      defaultValue: 'ncathinh21@clc.fitus.edu.vn',
    },
    {
      id: 'password',
      label: 'Password',
      placeholder: '',
      type: 'password',
      validation: {
        required: 'Password is required',
      },
      defaultValue: '1234567',
    },
  ],
} as const satisfies IForm;

export const SIGNUP_FORM = {
  fields: [
    {
      id: 'email',
      label: 'Email',
      placeholder: '',
      type: 'email',
      defaultValue: 'ncathinh21@clc.fitus.edu.vn',
      validation: {
        required: 'Email is required',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
          message: 'Email is invalid',
        },
      },
    },
    {
      id: 'username',
      label: 'Username',
      placeholder: '',
      type: 'text',
      defaultValue: 'Byron',
      validation: {
        required: 'Username is required',
        minLength: {
          value: 2,
          message: 'Username must be at least 2 characters',
        },
      },
    },
    {
      id: 'password',
      label: 'Password',
      placeholder: '',
      type: 'password',
      defaultValue: '1234567',
      validation: {
        required: 'Password is required',
        minLength: {
          value: 6,
          message: 'Password must be at least 6 characters',
        },
      },
    },
  ],
} as const satisfies IForm;

export const FORGOT_PASSWORD_FORM = {
  fields: [
    {
      id: 'email',
      label: 'Email',
      placeholder: '',
      type: 'email',
      validation: {
        required: 'Email is required',
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
          message: 'Email is invalid',
        },
      },
    },
  ],
} as const satisfies IForm;

export const RESET_PASSWORD_FORM = {
  fields: [
    {
      id: 'newPassword',
      label: 'New password',
      placeholder: '',
      type: 'password',
      validation: {
        required: 'Password is required',
        minLength: {
          value: 6,
          message: 'Password must be at least 6 characters',
        },
      },
    },
  ],
} as const satisfies IForm;

export type SignupFormData = FormData<typeof SIGNUP_FORM>;
export type LoginFormData = FormData<typeof LOGIN_FORM>;
export type ForgotPasswordFormData = FormData<typeof FORGOT_PASSWORD_FORM>;
export type ResetPasswordFormData = FormData<typeof RESET_PASSWORD_FORM>;
export type ChangeProfileFormData = {
  username: User['username'];
  currentPassword: User['password'];
  newPassword: User['password'];
};
