import type { Timer } from 'schema';
import clsx from 'clsx';
import { useTimer } from '@/providers';

export default function TimerSelection() {
  const { timerTypes, activeType, selectTimer, isRunning } = useTimer();

  return (
    <div className="flex justify-between">
      {Object.keys(timerTypes).map((type) => (
        <button
          key={type}
          onClick={() => selectTimer(type as Timer)}
          className={clsx(
            'text-sm',
            'px-4 py-2 rounded',
            activeType === type
              ? 'bg-primary text-on-primary'
              : isRunning
              ? 'cursor-default'
              : 'hover:opacity-60 transition-opacity duration 200',
          )}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
