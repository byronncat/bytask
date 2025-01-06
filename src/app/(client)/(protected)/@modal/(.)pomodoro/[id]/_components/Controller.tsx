import clsx from 'clsx';
import { useTimer } from '@/providers';

export default function Controls() {
  const { isRunning, handleStart, handleStop, handleReset } = useTimer();

  return (
    <div className="flex justify-between">
      {!isRunning ? (
        <button
          onClick={handleStart}
          className={clsx(
            'px-6 py-2',
            'bg-primary text-on-primary rounded',
            'hover:opacity-60 transition-opacity duration-150',
          )}
        >
          Start
        </button>
      ) : (
        <button
          onClick={handleStop}
          className={clsx(
            'px-6 py-2',
            'bg-primary text-on-primary rounded',
            'hover:opacity-60 transition-opacity duration-150',
          )}
        >
          Stop
        </button>
      )}
      <button
        onClick={handleReset}
        className={clsx(
          'px-6 py-2',
          'bg-primary text-on-primary rounded',
          'hover:opacity-60 transition-opacity duration-150',
        )}
      >
        Reset
      </button>
    </div>
  );
}
