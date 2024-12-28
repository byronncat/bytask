declare module 'api' {
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
    type: 'credentials' | 'google';
  };
}
