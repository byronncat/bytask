declare module 'form' {
  import type { RegisterOptions, FieldValues } from 'react-hook-form';

  export type IField<T extends FieldValues = FieldValues> = {
    id: string;
    label: string;
    placeholder: string;
    type: 'text' | 'email' | 'password' | 'number';
    validation?: RegisterOptions<T, Path<T>>;
    defaultValue?: string;
  };

  export type IForm<T extends FieldValues = FieldValues> = {
    fields: IField<T>[];
  };

  type FieldTypeMap = {
    text: string;
    email: string;
    password: string;
    number: number;
  };

  export type FormData<T extends IForm> = {
    [K in T['fields'][number] as K['id']]: K['type'] extends keyof FieldTypeMap
      ? FieldTypeMap[K['type']]
      : never;
  };
}
