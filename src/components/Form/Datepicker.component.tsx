'use client';

import type { Task } from 'schema';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';
import { formClassName } from './className';
import { format, parseISO } from 'date-fns';

function formatDateToLocal(isoDate?: string | Date) {
  if (!isoDate) return '';
  const date = isoDate instanceof Date ? isoDate : parseISO(isoDate);
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

interface DatepickerProps {
  id: string;
  label?: React.ReactNode;
  register: ReturnType<typeof useForm>['register'];
  className?: string;
  inputClassName?: string;
  defaultValue?: Task['start_date'] | Task['due_date'];
}

export default function Datepicker({
  id,
  label,
  register,
  className,
  inputClassName,
  defaultValue,
}: Readonly<DatepickerProps>) {
  const [selectedDate, setSelectedDate] = useState(defaultValue);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
  };

  useEffect(() => {
    if (defaultValue) setSelectedDate(defaultValue);
  }, [defaultValue]);

  return (
    <div className={clsx('relative', className)}>
      {label}
      <input
        id={id}
        type="datetime-local"
        {...register(id)}
        value={formatDateToLocal(selectedDate)}
        onChange={handleDateChange}
        className={clsx(
          'w-full h-10',
          'border-divider',
          formClassName,
          inputClassName,
        )}
      />
    </div>
  );
}
