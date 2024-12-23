'use client';

import type { LoginFormData } from '@/constants/form';

import clsx from 'clsx';
import { authAction } from '@/api';
import { toast } from '@/libraries/toast';
import { useAuth } from '@/providers';
import { Form, Divider, NavigationText } from '@/components';
import { LOGIN_FORM } from '@/constants/form';
import { ROUTE } from '@/constants/serverConfig';

export default function LoginPage() {
  const { login } = useAuth();

  async function handleLogin(data: LoginFormData) {
    const { success, message } = await authAction.login(data);
    if (success) {
      login();
    } else toast.error(message);
  }

  return (
    <>
      <Form
        formData={LOGIN_FORM}
        className="w-full"
        submitText="login"
        onSubmit={handleLogin}
      />
      <Divider className={clsx('mb-3 mt-5', 'text-xs uppercase')} text="or" />
      <NavigationText
        text="Don't have an account?"
        path={ROUTE.SIGNUP}
        hyperlink="Sign up"
        className={clsx('w-full', 'text-center', 'opacity-80')}
      />
    </>
  );
}
