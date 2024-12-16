type uuidv4 = string;

declare module 'schema' {
  export type IUser = {
    readonly id: uuidv4;
    email: string;
    username: string;
    password: string;
    profile_photo?: {
      url: string;
      orientation: 'landscape' | 'portrait' | 'square';
    };
  };

  export type Mission = MissionMetadata & {
    taskLists?: TaskList[];
  };

  export type MissionMetadata = {
    id: string;
    title: string;
    description?: string;
  };

  export type TaskList = {
    id: string;
    title: string;
    tasks: Task['id'][];
  };

  export type Task = {
    id: string;
    title: string;
    description?: string;
    label?: Label;
    startDate?: Date;
    dueDate?: Date;
  };

  export type Label = {
    name?: string;
    color: string;
  };
}
