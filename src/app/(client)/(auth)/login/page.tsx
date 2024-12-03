'use client';

import clsx from 'clsx';
import { authAction } from '@/api';
import { toast } from '@/libraries/toast';
import { useAuth } from '@/providers';
import { Form, Divider, NavigationText } from '@/components';
import { LOGIN_FORM } from '@/constants/form';
import type { LoginFormData } from '@/constants/form';

export default function LoginPage() {
  const { login } = useAuth();

  async function handleLogin(data: LoginFormData) {
    toast.loading('Logging in...');
    const { success, message } = await authAction.login(data);
    if (success) {
      toast.success(message);
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
        path="/signup"
        hyperlink="Sign up"
        className={clsx('w-full', 'text-center', 'opacity-80')}
      />
    </>
  );
}
