declare module 'schema' {
  import {
    ACCOUNT_TYPE,
    TASK_STATUS,
    TASK_PRIORITY,
  } from '@/constants/metadata';
  type uuidv4 = string;
  export type Timer = 'Pomodoro' | 'ShortBreak' | 'LongBreak';

  export type User = {
    readonly id: uuidv4;
    email: string;
    username: string;
    password?: string;
    type: ACCOUNT_TYPE;
    verified: boolean;
  };

  // export type Workspace = {
  //   readonly id: string;
  //   readonly uid: User['id'];
  //   label: Label[];
  // };

  export type TimeSession = {
    readonly id: string;
    readonly uid: User['id'];
    readonly task_id: Task['id'];
    start_at: string | Date;
    end_at: string | Date;
  };

  export type Task = {
    readonly id: string;
    readonly uid: User['id'];
    title: string;
    status: TASK_STATUS;
    priority: TASK_PRIORITY;
    description?: string;
    cover?: HexColor;
    start_date?: string | Date;
    due_date?: string | Date;
    recently_updated?: string | Date;
    created_at?: string | Date;
    // labels?: Label['id'][];
    // checklists?: Schecklist[];
  };

  // export type Schecklist = {
  //   readonly id: string;
  //   title: string;
  //   items: SchecklistItem[];
  // };

  // export type SchecklistItem = {
  //   readonly id: string;
  //   title: string;
  //   checked: boolean;
  // };

  // export type Label = {
  //   readonly id: string;
  //   name?: string;
  //   color: HexColor;
  // };
}
