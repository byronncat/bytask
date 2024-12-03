type uuidv4 = string;

declare module 'schema' {
  export type IUser = {
    readonly id: uuidv4;
    email: string;
    username: string;
    password: string;
    profile_photo?: {
      url: string;
      orientation: 'landscape' | 'portrait' | 'square';
    };
  };
}
