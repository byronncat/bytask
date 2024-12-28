'use client';

import type { ResetPasswordFormData } from '@/constants/form';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';

import { authAction_v1 } from '@/api';
import { Form } from '@/components';
import { toast } from '@/libraries/toast';
import { RESET_PASSWORD_FORM } from '@/constants/form';
import { ROUTE } from '@/constants/serverConfig';

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  async function resetPasswordHandler(data: ResetPasswordFormData) {
    if (!token) {
      toast.error('Invalid token!');
      return;
    }
    const { success, message } = await authAction_v1.resetPassword(
      token,
      data.newPassword,
    );
    toast[success ? 'success' : 'error'](message);
  }

  return (
    <>
      <Form
        formData={RESET_PASSWORD_FORM}
        className="w-full"
        submitText="Submit"
        onSubmit={resetPasswordHandler}
      />
      <Link
        href={ROUTE.LOGIN}
        className={clsx(
          'w-full',
          'mt-4 text-right block',
          'font-semibold text-sm text-primary',
          'hover:opacity-60 transition-opacity duration-300',
        )}
      >
        Login
      </Link>
    </>
  );
}
