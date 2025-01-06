declare type NextImage = {
  src: string;
  alt: string;
};

declare type Option = {
  id: number;
  option: React.ReactNode | string;
  value: string | number;
  default?: boolean;
};

declare type HexColor = string;

declare module 'analytics' {
  import { TASK_STATUS } from '@/constants/metadata';
  export type TaskStatusAnalytics = {
    status: TASK_STATUS;
    count: number;
  };

  export type DailyTimeAnalytics = {
    date: string | Date;
    totalTimeSpent: number;
  };

  export type CompareTimeAnalytics = {
    task_title: string;
    totalTimeSpent: number;
    totalTimeEstimated: number;
  };
}

declare module 'display' {
  import type { TimeSession } from 'schema';

  export type TimeSessionDisplay = TimeSession &
    Pick<Task, 'title' | 'due_date' | 'cover'>;
}
