'use client';

import type { LoginFormData } from '@/constants/form';

import clsx from 'clsx';
import { useAuth } from '@/providers';
import { Form, Divider } from '@/components';
import { NavigationText, GoogleButton } from '../_components';
import { LOGIN_FORM } from '@/constants/form';
import { ROUTE } from '@/constants/serverConfig';

export default function LoginPage() {
  const { login } = useAuth();

  async function loginHandler(data: LoginFormData) {
    await login('credentials', data);
  }

  return (
    <>
      <Form
        formData={LOGIN_FORM}
        className="w-full"
        submitText="Login"
        onSubmit={loginHandler}
        redirectLink={{
          href: ROUTE.FORGOT_PASSWORD,
          text: 'Forgot your password?',
        }}
      />
      <Divider className={clsx('my-3', 'text-xs uppercase')} text="or" />
      <GoogleButton />
      <NavigationText
        text="Don't have an account?"
        path={ROUTE.SIGNUP}
        hyperlink="Sign up"
        className={clsx('w-full mt-6', 'text-center')}
      />
    </>
  );
}
