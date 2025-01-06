'use client';

import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useTimer } from '@/providers';
import { Modal } from '@/components';
import { TimerSelection, CountdownRing, Controller } from './_components';

export default function PomodoroApp() {
  const router = useRouter();
  const { isRunning } = useTimer();

  return (
    <Modal>
      <div
        className={clsx(
          'bg-foreground rounded-lg',
          'p-6 pt-3 w-96',
          'relative',
        )}
      >
        <h3
          className={clsx(
            'text-center',
            'text-lg font-semibold',
            'mb-6',
            'dark:text-white',
          )}
        >
          Timer
        </h3>
        <button
          className={clsx(
            'text-primary',
            'm-3',
            'absolute top-0 right-0',
            isRunning
              ? 'cursor-default'
              : 'hover:opacity-60 transition-opacity duration-150',
          )}
          onClick={() => {
            if (isRunning) return;
            router.back();
          }}
        >
          Back
        </button>

        <TimerSelection />
        <CountdownRing
          strokeClassName="stroke-primary"
          strokeBgClassName="stroke-background"
          className="my-8"
        />
        <Controller />
      </div>
    </Modal>
  );
}
