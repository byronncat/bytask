declare module 'api' {
  export interface Api<T = void> {
    success: boolean;
    message: string;
    data?: T;
  }

  export type SessionPayload = {
    userId: string;
    expiresAt: Date;
  };
}
