import { z } from 'zod';
import type { ZodType } from 'zod';
import type { LoginFormData, SignupFormData } from '@/constants/form';

const LoginValidation: ZodType<LoginFormData> = z.object({
  identity: z
    .string({ message: 'Identity is required' })
    .email('Identity is invalid'),
  password: z
    .string({ message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
});

const SignupValidation: ZodType<SignupFormData> = z.object({
  email: z.string({ message: 'Email is required' }).email('Email is invalid'),
  username: z
    .string({ message: 'Username is required' })
    .min(2, { message: 'Username must be at least 2 characters' }),
  password: z
    .string({ message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
});

const ForgotPasswordValidation = z.object({
  email: z.string({ message: 'Email is required' }).email('Email is invalid'),
});

const validator = {
  login: LoginValidation.safeParse,
  signup: SignupValidation.safeParse,
  forgotPassword: ForgotPasswordValidation.safeParse,
  parseErrors,
};

function parseErrors(error: z.ZodError) {
  const validationErrors = Object.fromEntries(
    error.issues?.map((issue) => [issue.path[0], issue.message]) || [],
  );
  return validationErrors;
}

export default validator;
