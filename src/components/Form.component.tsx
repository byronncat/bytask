'use client';

import type {
  FieldValues,
  FieldError,
  Path,
  UseFormRegister,
  RegisterOptions,
  DefaultValues,
} from 'react-hook-form';
import type { IForm, IField } from 'form';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface FormProps<T extends FieldValues> {
  formData: IForm<T>;
  onSubmit: (data: T) => void;
  className?: string;
  submitText?: string;
  redirectLink?: {
    href: string;
    text: string;
  };
}

export default function Form<T extends FieldValues>({
  formData,
  onSubmit,
  className,
  submitText = 'submit',
  redirectLink,
}: Readonly<FormProps<T>>) {
  const defaultValues = formData.fields.reduce((acc, field) => {
    acc[field.id] = field.defaultValue ?? '';
    return acc;
  }, {} as DefaultValues<T>);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    defaultValues,
  });
  const [isFetching, setIsFetching] = useState(false);

  const submitHandler = handleSubmit(async (data) => {
    setIsFetching(true);
    try {
      await onSubmit(data);
    } finally {
      setIsFetching(false);
    }
  });

  return (
    <form onSubmit={submitHandler} className={clsx(className)}>
      <div className="space-y-2">
        {formData.fields.map((field) => (
          <Field
            key={field.id}
            id={field.id as Path<T>}
            type={field.type}
            label={field.label}
            placeholder={field.placeholder}
            register={register}
            error={errors[field.id] as FieldError}
            validation={field.validation}
          />
        ))}
      </div>

      {redirectLink && (
        <Link
          href={redirectLink.href}
          className={clsx(
            'mt-4 block',
            'text-primary text-sm text-right font-semibold',
            'hover:opacity-60 transition-opacity duration-200',
          )}
        >
          {redirectLink.text}
        </Link>
      )}
      <button
        type="submit"
        className={clsx(
          'block',
          'w-full h-10',
          redirectLink ? 'mt-3' : 'mt-6',
          'font-medium',
          'border border-primary',
          'rounded-md focus:outline-none',
          'bg-background text-primary',
          'disabled:opacity-60',
          !isFetching ? 'hover:bg-primary hover:text-background' : 'pr-6',
          'flex justify-center items-center',
          'transition-colors duration-200',
        )}
        disabled={isFetching}
      >
        <Spinner className={clsx(isFetching ? 'mr-2' : 'hidden')} />
        {submitText}
      </button>
    </form>
  );
}

interface FieldProps<T extends FieldValues> extends Omit<IField<T>, 'label'> {
  id: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  validation?: RegisterOptions<T, Path<T>>;
  label?: string | React.ReactNode;
}

export function Field<T extends FieldValues>({
  id,
  label,
  placeholder,
  type,
  register,
  error,
  validation,
}: FieldProps<T>) {
  const [inputType, setInputType] = useState(type);
  function passwordVisibilityHandler() {
    if (inputType === 'password') setInputType('text');
    else setInputType('password');
  }

  return (
    <div>
      {label &&
        (typeof label === 'string' ? (
          <label
            htmlFor={id}
            className={clsx(
              'block',
              'text-sm font-medium text-on-background/[.7]',
            )}
          >
            {label}
          </label>
        ) : (
          label
        ))}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          className={clsx(
            'block w-full h-10',
            'mt-1 px-3',
            'border',
            'rounded-md shadow-sm',
            'focus:ring focus:ring-on-background/[.2] focus:ring-opacity-50 focus:border-on-background sm:text-sm',
            'focus-visible:outline-none',
            error ? 'border-red-500' : 'border-on-background/[.2]',
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
              'opacity-60 hover:opacity-100 transition-opacity duration-200',
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
          <p className={clsx('text-red-500 text-xs italic', 'mt-1')}>
            🔥 {error?.message}
          </p>
        )}
      </div>
    </div>
  );
}

function Spinner({ className }: Readonly<{ className?: string }>) {
  return (
    <span
      className={clsx(
        className,
        'size-4',
        'border-2 border-primary',
        'rounded-full animate-spin',
        'border-solid border-t-transparent',
      )}
    />
  );
}
