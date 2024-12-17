'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import type {
  FieldValues,
  FieldError,
  Path,
  UseFormRegister,
  RegisterOptions,
  DefaultValues,
} from 'react-hook-form';
import type { IForm, IField } from 'form';

interface FormProps<T extends FieldValues> {
  formData: IForm<T>;
  onSubmit: (data: T) => void;
  className?: string;
  submitText?: string;
}

export default function Form<T extends FieldValues>({
  formData,
  onSubmit,
  className,
  submitText = 'submit',
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
      <div className="space-y-3">
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

      <button
        type="submit"
        className={clsx(
          'w-full h-10 block !mt-8',
          'font-medium capitalize',
          'border border-on-background',
          'rounded-md focus:outline-none',
          'bg-background text-on-background',
          'disabled:opacity-60',
          !isFetching ? 'hover:bg-on-background hover:text-background' : 'pr-6',
          'flex justify-center items-center',
        )}
        disabled={isFetching}
      >
        <Spinner className={clsx(isFetching ? 'mr-2' : 'hidden')} />
        {submitText}
      </button>
    </form>
  );
}

interface FieldProps<T extends FieldValues> extends IField<T> {
  id: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  validation?: RegisterOptions<T, Path<T>>;
}

function Field<T extends FieldValues>({
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
      <label
        htmlFor={id}
        className={clsx('block', 'text-sm font-medium text-on-background/[.9]')}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          className={clsx(
            'block w-full h-10',
            'mt-1 px-3',
            'border border-on-background/[.2]',
            'rounded-md shadow-sm',
            'focus:ring focus:ring-on-background/[.2] focus:ring-opacity-50 focus:border-on-background sm:text-sm',
            'focus-visible:outline-none',
          )}
          {...register(id, validation)}
        />
        {type === 'password' && (
          <button
            type="button"
            className={clsx(
              'h-full w-12',
              'absolute top-0 right-0',
              'flex justify-center items-center',
              'text-xl',
              'opacity-60 hover:opacity-100 transition-opacity duration-300',
            )}
            onClick={passwordVisibilityHandler}
          >
            <FontAwesomeIcon
              icon={inputType === 'password' ? faEye : faEyeSlash}
              className={clsx('size-4', 'fill-on-foreground/[.7]')}
            />
          </button>
        )}
        {error && (
          <p className={clsx('text-red-500 text-xs italic', 'mt-3')}>
            {error.message}
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
        'border-2 border-on-background',
        'rounded-full animate-spin',
        'border-solid border-t-transparent',
      )}
    />
  );
}
