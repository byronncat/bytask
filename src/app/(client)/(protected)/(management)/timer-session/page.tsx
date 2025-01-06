'use client';

import type { Activity, DaySectionData } from './types';
import { useEffect, useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { timeSessionAction } from '@/api';
import { transformTimeSessions } from './utility';
import { useGlobal } from '@/providers';

export default function TimeTrackingUI() {
  const [timeSessions, setTimeSessions] = useState<DaySectionData[]>([]);
  const { _refresh } = useGlobal();

  const fetchTimeSessions = useCallback(async () => {
    const { success, data } = await timeSessionAction.getMany();
    if (success && data) {
      const transformedData = transformTimeSessions(data);
      setTimeSessions(transformedData);
    }
  }, []);

  useEffect(() => {
    fetchTimeSessions();
  }, [fetchTimeSessions, _refresh]);

  return (
    <div>
      {timeSessions.map((day, index) => (
        <DaySection key={index} {...day} />
      ))}
    </div>
  );
}

interface ActivityCardProps {
  sessionId: TimeSession['id'];
  task: Pick<Task, 'title' | 'due_date' | 'cover'>;
  timeRange: string;
  totalTime: string;
  className?: string;
}

function ActivityCard({
  sessionId,
  task: { title, due_date, cover },
  timeRange,
  totalTime,
  className,
}: ActivityCardProps) {
  const { refresh } = useGlobal();
  async function handleDelete() {
    const { success } = await timeSessionAction.remove(sessionId);
    if (success) refresh();
  }

  return (
    <div
      className={clsx(
        'h-10 px-3',
        'flex justify-between items-center',
        'transition-[background-color] duration-150',
        className,
      )}
    >
      <Title title={title} due_date={due_date} color={cover} />
      <div className={clsx('flex items-center', 'space-x-4')}>
        <span className="text-on-foreground/[.6] text-sm">{timeRange}</span>
        <span className="font-mono text-sm">{totalTime}</span>
        <button
          className={clsx(
            'text-red-500 dark:text-red-400',
            'hover:opacity-60 transition-opacity duration-150',
          )}
          onClick={handleDelete}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
}

interface DaySectionProps {
  date: string;
  activities: Activity[];
}

function DaySection({ date, activities }: DaySectionProps) {
  return (
    <div
      className={clsx(
        'bg-foreground text-on-forground',
        'shadow overflow-hidden',
        'mb-6',
        'border border-divider',
      )}
    >
      <div
        className={clsx(
          'p-3',
          'bg-on-background/[.07]',
          'font-semibold',
          'border-b border-divider',
        )}
      >
        {date}
      </div>
      <div className="divide-y divide-divider">
        {activities.map((activity: Activity) => (
          <ActivityCard
            {...activity}
            key={activity.id}
            sessionId={activity.id}
          />
        ))}
      </div>
    </div>
  );
}

import type { Task, TimeSession } from 'schema';
import { isOverdue } from '@/utilities';
import { StatusTag } from '@/components';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function Title({
  title,
  color,
  due_date,
}: Readonly<{ title: string; color?: HexColor; due_date?: Task['due_date'] }>) {
  return (
    <div className="flex items-center text-sm">
      <span
        className={clsx(
          'size-2 mr-2',
          'flex justify-center items-center',
          'font-semibold ext-white',
        )}
        style={{ backgroundColor: color }}
      />
      {title}
      {isOverdue(due_date) && <StatusTag status="overdue" className="ml-2" />}
    </div>
  );
}
