export enum STATUS {
  TODO,
  IN_PROGRESS,
  DONE,
  ARCHIVED,
}

export enum SORT_ORDER {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SORT_BY {
  TITLE = 'title',
  ACTIVED_AT = 'dateLastActivity',
}

export enum FILTER_BY {
  TODO = 'todo',
  IN_PROGRESS = 'inProgress',
  DONE = 'done',
  ARCHIVED = 'archived',
}
