'use client';

import type { Task } from 'schema';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { ROUTE } from '@/constants/serverConfig';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface TimerButtonProps {
  taskId?: Task['id'];
}

export default function TimerButton({ taskId }: TimerButtonProps) {
  const router = useRouter();

  if (!taskId) return null;
  return (
    <>
      <button
        onClick={() => router.push(`${ROUTE.POMODORO}/${taskId}`)}
        className={clsx(
          'size-8 rounded-full',
          'flex items-center justify-center',
          'hover:opacity-60 transistion-opacity duration-150',
        )}
      >
        <FontAwesomeIcon icon={faStopwatch} className="size-6" />
      </button>
    </>
  );
}
