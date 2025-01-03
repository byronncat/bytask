declare module 'api' {
  import { ACCOUNT_TYPE } from '@/constants/metadata';
  import type { User } from 'schema';

  export interface Api<T = void> {
    success: boolean;
    message: string;
    data?: T;
  }

  export type SessionPayload = {
    id: User['id'];
    name: User['username'];
    email: User['email'];
    type: ACCOUNT_TYPE;
  };
}
