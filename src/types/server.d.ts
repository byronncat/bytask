declare module 'api' {
  export interface IApi<T = void> {
    success: boolean;
    message: string;
    data?: T;
  }

  export type SessionPayload = {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}
