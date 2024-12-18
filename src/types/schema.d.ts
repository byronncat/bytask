declare module 'schema' {
  type uuidv4 = string;
  type HexColor = string;
  type Status = number;

  export type IUser = {
    readonly id: uuidv4;
    email: string;
    username: string;
    password: string;
    profile_photo?: Image;
  };

  export type IMission = {
    readonly id: string;
    user_id: IUser['id'];
    title: string;
    labels: ILabel[];
    description?: string;
    status: Status;
    actived_at?: Date;
    created_at?: Date;
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
    label?: ILabel['id'];
    startDate?: Date;
    dueDate?: Date;
  };

  export type ILabel = {
    readonly id: string;
    name?: string;
    color: HexColor;
  };

  type Image = {
    url: string;
    orientation: 'landscape' | 'portrait' | 'square';
  };
}
