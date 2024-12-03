'use client';

import clsx from 'clsx';
import { authAction } from '@/api';
import { toast } from '@/libraries/toast';
import { useAuth } from '@/providers';
import { Form, Divider, NavigationText } from '@/components';
import { SIGNUP_FORM } from '@/constants/form';
import type { SignupFormData } from '@/constants/form';

export default function SignupPage() {
  const { login } = useAuth();

  async function handleSignup(data: SignupFormData) {
    toast.loading('Signing up...');
    const { success, message } = await authAction.signup(data);
    if (success) {
      toast.success(message);
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
        path="/login"
        hyperlink="Log in"
        className={clsx('w-full', 'text-center', 'opacity-80')}
      />
    </>
  );
}
