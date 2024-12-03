import type { IForm, FormData } from 'form';

export const LOGIN_FORM = {
  fields: [
    {
      id: 'identity',
      label: 'Username or Email',
      placeholder: '',
      type: 'text',
      validation: {
        required: 'Username or Email is required',
      },
    },
    {
      id: 'password',
      label: 'Password',
      placeholder: '',
      type: 'password',
      validation: {
        required: 'Password is required',
      },
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
      validation: {
        required: 'Username is required',
        minLength: {
          value: 2,
          message: 'Username must be at least 2 characters',
        },
        pattern: {
          value: /^[a-zA-Z0-9._-]+$/,
          message:
            'Only letters, numbers, underscores, dots, and hyphens are allowed',
        },
      },
    },
    {
      id: 'password',
      label: 'Password',
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
