import type { Api } from 'api';
import type {
  ChangePasswordFormData,
  SetNewPasswordFormData,
  ChangeProfileFormData,
} from '@/constants/form';
import { SERVER_API } from '@/constants/serverConfig';

const apiUrl = {
  updateAccount: `${SERVER_API}/v1/users`,
  changePassword: `${SERVER_API}/v1/users/password`,
};

export async function updateAccount(
  data: ChangeProfileFormData,
): Promise<Api<ChangeProfileFormData>> {
  return await fetch(apiUrl.updateAccount, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw data as Api['message'];
      return {
        success: true,
        message: 'Account updated successfully',
        data: data as ChangeProfileFormData,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}

export async function changePassword(
  data: ChangePasswordFormData | SetNewPasswordFormData,
): Promise<Api> {
  return await fetch(apiUrl.changePassword, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      const message = (await res.json()) as Api['message'];
      if (!res.ok) throw message;
      return {
        success: true,
        message,
      };
    })
    .catch((error) => {
      return {
        success: false,
        message: error,
      };
    });
}
