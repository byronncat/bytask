'use client';

import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Divider, TaskForm } from '@/components';
import { ROUTE } from '@/constants/serverConfig';

export default function CreateModal() {
  const router = useRouter();

  return (
    <div className={clsx('size-full', 'overflow-y-auto')}>
      <div className={clsx('p-4 pt-8', 'max-w-xl', 'mx-auto')}>
        <h2 className={clsx('text-2xl font-semibold', 'mb-5')}>Create</h2>
        <Divider />
        <TaskForm
          onExit={() => router.push(ROUTE.CARD_VIEW)}
          className="size-full"
          type="form"
        />
      </div>
    </div>
  );
}
