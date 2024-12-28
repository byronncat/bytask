'use client';

import type { IForm } from 'form';
import type { ChangeProfileFormData } from '@/constants/form';

import { userAction } from '@/api';
import { useAuth } from '@/providers';
import { Form } from '@/components';
import { toast } from '@/libraries/toast';

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
      ...(user.type === 'credentials'
        ? [
            {
              id: 'currentPassword',
              label: 'Current password',
              placeholder: '',
              type: 'password',
              validation: {
                required: 'Current password is required',
              },
            },
          ]
        : []),
      {
        id: 'newPassword',
        label: 'New password',
        placeholder: '',
        type: 'password',
        validation: {
          ...(user.type === 'credentials' && {
            required: 'New password is required',
          }),
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        },
      },
    ],
  } as IForm<ChangeProfileFormData>;

  async function updateHandler(data: ChangeProfileFormData) {
    if (!user) return;
    const {
      success,
      message,
      data: userData,
    } = await userAction.updateAccount(user.id, data);
    if (success && userData) {
      updateUserData(userData);
      toast.success('Profile updated successfully.');
    } else toast.error(message);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">Account</h2>
      <Form
        formData={CHANGE_PROFILE_FORM}
        className="w-[25rem] mt-6"
        submitText="Change"
        onSubmit={updateHandler}
      />
    </div>
  );
}
