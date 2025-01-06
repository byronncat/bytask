'use client';

import type {
  FieldValues,
  FieldError,
  Path,
  DefaultValues,
  PathValue,
} from 'react-hook-form';
import type { IForm } from 'form';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { TextInput } from './';

interface FormProps<T extends FieldValues> {
  formData: IForm<T>;
  onSubmit: (data: T) => void;
  className?: string;
  submitText?: string;
  Label?: React.FC<{ id: string; children: React.ReactNode }>;
  clearOnSubmit?: boolean;
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
  Label,
  redirectLink,
  clearOnSubmit,
}: Readonly<FormProps<T>>) {
  const defaultValues = formData.fields.reduce((acc, field) => {
    acc[field.id] = field.defaultValue ?? '';
    return acc;
  }, {} as DefaultValues<T>);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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
      if (clearOnSubmit) {
        Object.keys(defaultValues).forEach((key) => {
          setValue(key as Path<T>, '' as PathValue<T, Path<T>>); // Use `setValue` to clear the field
        });
      }
    }
  });

  return (
    <form onSubmit={submitHandler} className={clsx(className)}>
      <div className="space-y-2">
        {formData.fields.map((field) => (
          <TextInput
            key={field.id}
            id={field.id as Path<T>}
            type={field.type}
            label={Label && <Label id={field.id}>{field.label}</Label>}
            placeholder={field.placeholder}
            register={register}
            error={errors[field.id] as FieldError}
            validation={field.validation}
            className="w-full"
          />
        ))}
      </div>

      {redirectLink && (
        <Link
          href={redirectLink.href}
          className={clsx(
            'mt-4 block',
            'text-primary text-sm text-right font-semibold',
            'hover:opacity-60 transition-opacity duration-150',
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
          'transition-colors duration-150',
        )}
        disabled={isFetching}
      >
        <Spinner className={clsx(isFetching ? 'mr-2' : 'hidden')} />
        {submitText}
      </button>
    </form>
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
