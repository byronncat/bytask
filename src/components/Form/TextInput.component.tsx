'use client';

import type {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import type { IField } from 'form';

import { useState } from 'react';
import clsx from 'clsx';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { errorClassName, formClassName } from './className';

interface FieldProps<T extends FieldValues> extends Omit<IField<T>, 'label'> {
  id: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  validation?: RegisterOptions<T, Path<T>>;
  label?: React.ReactNode;
  className?: string;
  inputClassName?: string;
}

export default function Field<T extends FieldValues>({
  id,
  label,
  placeholder,
  type,
  register,
  error,
  validation,
  className,
  inputClassName,
}: FieldProps<T>) {
  const [inputType, setInputType] = useState(type);
  function passwordVisibilityHandler() {
    if (inputType === 'password') setInputType('text');
    else setInputType('password');
  }

  return (
    <div className={className}>
      {label}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          className={clsx(
            'block w-full h-10',
            formClassName,
            inputClassName,
            error ? 'border-red-500' : 'border-divider',
          )}
          {...register(id, validation)}
        />
        {type === 'password' && (
          <button
            type="button"
            className={clsx(
              'text-xl',
              'h-10 w-12',
              'absolute top-0 right-0',
              'flex justify-center items-center',
              'opacity-60 hover:opacity-100 transition-opacity duration-150',
            )}
            onClick={passwordVisibilityHandler}
          >
            <FontAwesomeIcon
              icon={inputType === 'password' ? faEye : faEyeSlash}
              className="size-4"
            />
          </button>
        )}
        {error && (
          <p className={clsx(errorClassName, 'mt-1')}>🔥 {error?.message}</p>
        )}
      </div>
    </div>
  );
}
