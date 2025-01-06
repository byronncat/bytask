import type { Task } from 'schema';

export type Activity = {
  id: string;
  task: Pick<Task, 'title' | 'due_date' | 'cover'>;
  timeRange: string;
  totalTime: string;
};

export type DaySectionData = {
  date: string;
  activities: Activity[];
};
