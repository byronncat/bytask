'use client';

import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useTimer } from '@/providers';

export default function Modal({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const { isRunning } = useTimer();

  function onExit() {
    if (isRunning) return;
    router.back();
  }

  return (
    <div
      className={clsx(
        'absolute inset-0 z-20',
        'bg-black/[.2]',
        'flex items-center justify-center',
      )}
      onClick={onExit}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
