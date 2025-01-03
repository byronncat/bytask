'use client';

import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { ROUTE } from '@/constants/serverConfig';

export default function CreateButton() {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => router.push(ROUTE.CREATE_TASK)}
        className="size-full"
      >
        <div
          className={clsx(
            'h-8 px-2 w-fit',
            'flex items-center justify-center',
            'rounded',
            'text-sm font-semibold',
            'bg-primary text-foreground',
            'hover:opacity-60 transition-opacity duration-200',
          )}
        >
          Create
        </div>
      </button>
    </>
  );
}
