import type { Mission } from 'schema';
// import type { FieldError } from 'react-hook-form';

import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';

// import { Field } from '@/components';
import { missionAction } from '@/api';
// import { useOutsideAlerter } from '@/hooks';
import { ROUTE } from '@/constants/serverConfig';

export default function CreateModal({
  onExit,
  className,
}: Readonly<{
  onExit: () => void;
  className?: string;
}>) {
  const router = useRouter();
  const {
    // register,
    handleSubmit,
    // formState: { errors },
  } = useForm();

  async function createMissionHandler(data: Partial<Mission>) {
    if (!data.title) return;
    const { success, data: missionId } = await missionAction.create({
      title: data.title,
    });
    if (success) router.push(`${ROUTE.BOARD_VIEW}/${missionId}`);
  }

  function submitHandler({ title }: Partial<Mission>) {
    createMissionHandler({ title });
  }

  const ref = useRef<HTMLDivElement>(null);
  // useOutsideAlerter(ref, onExit);

  // const backgrounds = [
  //   'bg-gray-200', // Plain
  //   'bg-yellow-300', // Gradient/Yellow
  //   'bg-blue-500', // Blue
  //   'bg-purple-500', // Purple
  //   'bg-green-500', // Green
  //   'bg-red-500', // Red
  // ];

  return (
    <div ref={ref}>
      <div
        className={clsx(
          'w-80 p-3',
          'bg-background text-on-background',
          'border border-divider',
          'rounded-lg shadow-lg',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={clsx('text-sm font-semibold', 'mb-4', 'text-center')}>
          Create board
        </h2>

        {/* <div className={clsx('flex space-x-2', 'mb-4')}>
          {backgrounds.map((bg, index) => (
            <div
              key={index}
              className={clsx('h-8 w-40', 'rounded-lg cursor-pointer', bg)}
            />
          ))}
        </div> */}

        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="mb-6">
            {/* <Field
              key="title"
              id="title"
              type="text"
              label={
                <label
                  htmlFor="title"
                  className={clsx('block', 'text-sm font-semibold')}
                >
                  Board title <span className="text-red-500">*</span>
                </label>
              }
              placeholder=""
              register={register}
              validation={{
                required: 'This field is required',
              }}
              error={errors['title'] as FieldError}
            /> */}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className={clsx(
                'px-4 py-2',
                'text-sm font-semibold',
                'rounded-md',
                'hover:opacity-60',
              )}
              onClick={onExit}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={clsx(
                'px-4 py-2',
                'rounded-md',
                'text-sm font-semibold',
                'bg-primary text-background',
                'hover:opacity-60',
              )}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
