import clsx from 'clsx';
import { useTimer } from '@/providers';

interface CountdownRingProps {
  size?: number;
  strokeWidth?: number;
  strokeClassName?: string;
  strokeBgClassName?: string;
  className?: string;
}

export default function CountdownRing({
  size = 240,
  strokeWidth = 10,
  strokeClassName,
  strokeBgClassName,
  className,
}: Readonly<CountdownRingProps>) {
  const {
    timerValue: timeLeft,
    isRunning,
    getTotalTime,
    handleTimeChange,
  } = useTimer();

  const radius = (size - strokeWidth) / 2; // Radius depends on size and stroke width
  const strokeDasharray = 2 * Math.PI * radius; // Circumference of the circle
  const strokeDashoffset =
    strokeDasharray - (timeLeft / getTotalTime()) * strokeDasharray; // Remaining dash length

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center',
        'relative',
        className,
      )}
    >
      <svg
        className="transform rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeBgClassName}
          strokeWidth={strokeWidth}
          fill="none"
          className={strokeBgClassName}
        />
        {/* Countdown Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeClassName}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={clsx('transition-all duration-1000', strokeClassName)}
        />
      </svg>
      <div
        className={clsx(
          'text-3xl font-bold',
          'absolute top-0 left-0',
          'size-full flex justify-center items-center',
        )}
      >
        <button
          {...handleTimeChange(-60)}
          className={clsx(
            'size-9',
            'flex justify-center items-center',
            'hover:opacity-60 transition-opacity duration-150',
            isRunning ? 'hidden' : 'block',
          )}
        >
          -
        </button>
        <p className="select-none">{formatTime(timeLeft)}</p>
        <button
          {...handleTimeChange(60)}
          className={clsx(
            'size-9',
            'flex justify-center items-start',
            'hover:opacity-60 transition-opacity duration-150',
            isRunning ? 'hidden' : 'block',
          )}
        >
          +
        </button>
      </div>
    </div>
  );
}

const formatTime = (time: number) => {
  const minutes = String(Math.floor(time / 60)).padStart(2, '0');
  const seconds = String(time % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};
