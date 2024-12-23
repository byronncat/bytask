'use client';

import type { SignupFormData } from '@/constants/form';

import clsx from 'clsx';
import { authAction } from '@/api';
import { toast } from '@/libraries/toast';
import { useAuth } from '@/providers';
import { Form, Divider, NavigationText } from '@/components';
import { SIGNUP_FORM } from '@/constants/form';
import { ROUTE } from '@/constants/serverConfig';

export default function SignupPage() {
  const { login } = useAuth();

  async function handleSignup(data: SignupFormData) {
    const { success, message } = await authAction.signup(data);
    if (success) {
      login();
    } else toast.error(message);
  }

  return (
    <>
      <Form
        formData={SIGNUP_FORM}
        className="w-full"
        submitText="sign up"
        onSubmit={handleSignup}
      />
      <Divider className={clsx('mb-3 mt-5', 'text-xs uppercase')} text="or" />
      <NavigationText
        text="Already have an account?"
        path={ROUTE.LOGIN}
        hyperlink="Log in"
        className={clsx('w-full', 'text-center', 'opacity-80')}
      />
    </>
  );
}
