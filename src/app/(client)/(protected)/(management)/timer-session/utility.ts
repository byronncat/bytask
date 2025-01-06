import type { DaySectionData } from './types';
import type { TimeSessionDisplay } from 'display';

export const formatTimeRange = (start: string | Date, end: string | Date) => {
  const startTime = new Date(start).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endTime = new Date(end).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${startTime} - ${endTime}`;
};

export const calculateTotalTime = (
  start: string | Date,
  end: string | Date,
) => {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const diffInSeconds = Math.floor((endTime - startTime) / 1000);

  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const transformTimeSessions = (data: TimeSessionDisplay[]) => {
  const groupedByDate: Record<string, DaySectionData> = {};

  data.forEach((session) => {
    const date = new Date(session.start_at).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    if (!groupedByDate[date]) {
      groupedByDate[date] = { date, activities: [] };
    }

    groupedByDate[date].activities.push({
      id: session.id,
      task: {
        title: session.title,
        due_date: session.due_date,
        cover: session.cover,
      },
      timeRange: formatTimeRange(session.start_at, session.end_at),
      totalTime: calculateTotalTime(session.start_at, session.end_at),
    });
  });

  return Object.values(groupedByDate);
};
