declare module 'schema' {
  import { ACCOUNT_TYPE, TASK_STATUS } from '@/constants/metadata';
  type uuidv4 = string;

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

  export type Task = {
    readonly id: string;
    readonly uid: User['id'];
    title: string;
    status: TASK_STATUS;
    description?: string;
    cover?: HexColor;
    start_date?: string;
    due_date?: string;
    recently_updated?: string;
    created_at?: string;
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
