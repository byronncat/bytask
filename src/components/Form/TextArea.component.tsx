'use client';

import type { FieldError } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { errorClassName, formClassName } from './className';

interface TextAreaProps {
  id: string;
  label: React.ReactNode;
  placeholder: string;
  register: ReturnType<typeof useForm>['register'];
  validation?: Record<string, string>;
  error: FieldError;
  className?: string;
  inputClassName?: string;
}

export default function TextArea({
  id,
  label,
  placeholder,
  register,
  validation,
  error,
  className,
  inputClassName,
}: Readonly<TextAreaProps>) {
  return (
    <div className={clsx('flex flex-col', className)}>
      {label}
      <textarea
        id={id}
        placeholder={placeholder}
        className={clsx(
          'py-2',
          formClassName,
          inputClassName,
          error ? 'border-red-500' : 'border-divider',
        )}
        {...register(id, validation)}
      />
      {error && (
        <span className={clsx(errorClassName, 'mt-1')}>{error.message}</span>
      )}
    </div>
  );
}
