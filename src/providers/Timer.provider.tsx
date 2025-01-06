'use client';

import type { Timer, TimeSession, Task } from 'schema';
import { usePathname } from 'next/navigation';
import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { timeSessionAction } from '@/api';
import { toast } from '@/libraries/toast';
import { useGlobal } from './Global.provider';

const TimerContext = createContext(
  {} as {
    timerTypes: Record<Timer, number>;
    activeType: Timer;
    timerValue: number;
    selectTimer: (type: Timer) => void;
    isRunning: boolean;
    reset: boolean;
    handleTimeChange: (amount: number) => {
      onMouseDown: (event: React.MouseEvent | React.TouchEvent) => void;
      onMouseUp: () => void;
      onMouseLeave: () => void;
      onTouchStart: (event: React.TouchEvent) => void;
      onTouchEnd: () => void;
    };
    handleStart: () => void;
    handleStop: () => ReturnType<typeof timeSessionAction.create>;
    handleReset: () => void;
    getTotalTime: () => number;
  },
);

export const useTimer = () => useContext(TimerContext);

export default function TimerProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [timerTypes, setTimerTypes] = useState<Record<Timer, number>>({
    Pomodoro: 1500,
    ShortBreak: 300,
    LongBreak: 900,
  });
  const [activeType, setActiveType] = useState<Timer>('Pomodoro');
  const [timerValue, setTimerValue] = useState(timerTypes[activeType]);
  const [isRunning, setIsRunning] = useState(false);
  const [reset, setReset] = useState(false);

  const pathname = usePathname();
  const taskId = pathname.split('/').pop() as Task['id'];
  const { refresh } = useGlobal();

  const focusSession = useRef<Partial<TimeSession>>({
    task_id: undefined,
    start_at: undefined,
    end_at: undefined,
  });

  const submitFocusSession = useCallback(async () => {
    if (!taskId || activeType !== 'Pomodoro')
      return { success: false, message: 'Invalid task or timer type' };
    const data = {
      ...focusSession.current,
      task_id: taskId,
    };
    return await timeSessionAction.create(data);
  }, [taskId, activeType]);

  function selectTimer(type: Timer) {
    if (isRunning) return;
    setActiveType(type);
    setTimerValue(timerTypes[type]);
  }

  function adjustTime(type: Timer, amount: number) {
    setTimerTypes((prev) => ({
      ...prev,
      [type]: Math.max(60, prev[type] + amount),
    }));
    if (activeType === type) {
      setTimerValue((prev) => Math.max(60, prev + amount));
    }
  }

  function handleStart() {
    if (isRunning || timerValue <= 0) return;
    setIsRunning(true);
    focusSession.current.start_at = new Date();
  }
  const handleStop = useCallback(async () => {
    if (!isRunning) return { success: false, message: 'Timer is not running' };
    setIsRunning(false);
    focusSession.current.end_at = new Date();
    return submitFocusSession();
  }, [isRunning, submitFocusSession]);

  function handleReset() {
    setIsRunning(false);
    setReset(!reset);
  }

  function getTotalTime() {
    return timerTypes[activeType];
  }

  const intervalId = useRef<NodeJS.Timeout | null>(null);
  function handleTimeChange(amount: number) {
    function startAdjusting() {
      adjustTime(activeType, amount);
      if (!intervalId.current) {
        intervalId.current = setInterval(
          () => adjustTime(activeType, amount),
          100,
        );
      }
    }

    function stopAdjusting() {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    }

    return {
      onMouseDown: startAdjusting,
      onMouseUp: stopAdjusting,
      onMouseLeave: stopAdjusting,
      onTouchStart: startAdjusting,
      onTouchEnd: stopAdjusting,
    };
  }

  useEffect(() => {
    if (!isRunning) return;
    if (timerValue <= 0) {
      handleTimeUp();
      return;
    }
    const timer = setInterval(() => {
      setTimerValue((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);

    async function handleTimeUp() {
      const { success, message } = await handleStop();
      if (success) {
        toast.success('Time is up!');
        refresh();
      } else toast.error(message);
    }
  }, [timerValue, isRunning, handleStop, refresh]);

  useEffect(() => {
    setTimerValue(timerTypes[activeType]);
  }, [reset, activeType, timerTypes]);

  return (
    <TimerContext.Provider
      value={{
        timerTypes,
        activeType,
        timerValue,
        selectTimer,
        isRunning,
        reset,
        handleTimeChange,
        handleStart,
        handleStop,
        handleReset,
        getTotalTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}
