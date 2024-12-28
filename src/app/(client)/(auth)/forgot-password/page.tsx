'use client';

import type { ForgotPasswordFormData } from '@/constants/form';

import Link from 'next/link';
import clsx from 'clsx';

import { authAction_v1 } from '@/api';
import { Form } from '@/components';
import { toast } from '@/libraries/toast';
import { FORGOT_PASSWORD_FORM } from '@/constants/form';
import { ROUTE } from '@/constants/serverConfig';

export default function ForgotPasswordPage() {
  async function sendEmailHandler(data: ForgotPasswordFormData) {
    const { success, message } = await authAction_v1.forgotPassword(data.email);
    toast[success ? 'success' : 'error'](message);
  }

  return (
    <>
      <Form
        formData={FORGOT_PASSWORD_FORM}
        className="w-full"
        submitText="Send reset email"
        onSubmit={sendEmailHandler}
      />
      <Link
        href={ROUTE.LOGIN}
        className={clsx(
          'w-full',
          'mt-4 text-right block',
          'font-semibold text-sm text-primary',
          'hover:opacity-60 transition-opacity duration-200',
        )}
      >
        Back to login
      </Link>
    </>
  );
}
