declare module 'schema' {
  type uuidv4 = string;
  type HexColor = string;
  type Status = number;

  export type User = {
    readonly id: uuidv4;
    email: string;
    username: string;
    password?: string;
    verified: boolean;
  };

  export type Mission = {
    readonly id: string;
    user_id: User['id'];
    title: string;
    labels: ILabel[];
    description?: string;
    status: Status;
    actived_at?: Date;
    created_at?: Date;
  };

  export type ITaskList = {
    readonly id: string;
    title: string;
    mission_id: Mission['id'];
  };

  export type ITask = {
    readonly id: string;
    title: string;
    mission_id: Mission['id'];
    list_id: ITaskList['id'];
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
