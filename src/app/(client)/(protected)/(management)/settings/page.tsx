'use client';

import type { IForm } from 'form';
import type {
  ChangePasswordFormData,
  ChangeProfileFormData,
  SetNewPasswordFormData,
} from '@/constants/form';

import clsx from 'clsx';
import { userAction } from '@/api';
import { useAuth } from '@/providers';
import { toast } from '@/libraries/toast';
import { Form } from '@/components';
import { CHANGE_PASSWORD_FORM, SET_NEW_PASSWORD_FORM } from '@/constants/form';
import { ACCOUNT_TYPE } from '@/constants/metadata';

export default function ProfilePage() {
  const { user, updateUserData } = useAuth();
  if (!user) return null;

  const CHANGE_PROFILE_FORM = {
    fields: [
      {
        id: 'username',
        label: 'Username',
        placeholder: '',
        type: 'text',
        defaultValue: user?.name,
        validation: {
          required: 'Username is required',
          minLength: {
            value: 2,
            message: 'Username must be at least 2 characters',
          },
        },
      },
    ],
  } as IForm<ChangeProfileFormData>;

  async function profileHandler(data: ChangeProfileFormData) {
    const {
      success,
      message,
      data: userData,
    } = await userAction.updateAccount(data);
    if (success && userData) {
      updateUserData(userData);
      toast.success('Profile updated successfully.');
    } else toast.error(message);
  }

  async function passwordHandler(
    data: ChangePasswordFormData | SetNewPasswordFormData,
  ) {
    const { success, message } = await userAction.changePassword(data);
    toast[success ? 'success' : 'error'](message);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Account</h2>
      <Form
        formData={CHANGE_PROFILE_FORM}
        className="w-[25rem] mt-6"
        submitText="Update"
        onSubmit={profileHandler}
        Label={Label}
      />
      <h2 className="text-xl font-semibold mt-12">Security</h2>
      <Form
        formData={
          user.type === ACCOUNT_TYPE.GOOGLE
            ? SET_NEW_PASSWORD_FORM
            : CHANGE_PASSWORD_FORM
        }
        className="w-[25rem] mt-6"
        submitText={
          user.type === ACCOUNT_TYPE.GOOGLE ? 'Set password' : 'Change password'
        }
        onSubmit={passwordHandler}
        Label={Label}
        clearOnSubmit
      />
    </div>
  );
}

function Label({
  id,
  children,
}: Readonly<{
  id: string;
  children: React.ReactNode;
}>) {
  return (
    <label
      htmlFor={id}
      className={clsx('block', 'text-sm font-medium text-on-background/[.7]')}
    >
      {children}
    </label>
  );
}
