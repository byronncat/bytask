'use client';

import type { SignupFormData } from '@/constants/form';

import clsx from 'clsx';
import { authAction_v1 } from '@/api';
import { Form, Divider } from '@/components';
import { NavigationText, GoogleButton } from '../_components';
import { toast } from '@/libraries/toast';
import { SIGNUP_FORM } from '@/constants/form';
import { ROUTE } from '@/constants/serverConfig';

export default function SignupPage() {
  async function signupHandler(data: SignupFormData) {
    const { success, message } = await authAction_v1.signup(data);
    if (success) {
      toast.success(message);
    } else toast.error(message);
  }

  return (
    <>
      <Form
        formData={SIGNUP_FORM}
        className="w-full"
        submitText="Sign up"
        onSubmit={signupHandler}
      />
      <Divider className={clsx('my-3', 'text-xs uppercase')} text="or" />
      <GoogleButton />
      <NavigationText
        text="Already have an account?"
        path={ROUTE.LOGIN}
        hyperlink="Log in"
        className={clsx('w-full mt-6', 'text-center')}
      />
    </>
  );
}
