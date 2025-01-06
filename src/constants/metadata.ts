export enum ACCOUNT_TYPE {
  CREDENTIALS,
  GOOGLE,
}

export enum TASK_STATUS {
  TODO, // 0 - Tasks that are ready to be worked on.
  IN_PROGRESS, // 1 - Tasks currently being worked on.
  ON_HOLD, // 2 - Tasks that are temporarily paused.
  REVIEW, // 3 - Tasks completed but waiting for review or approval.
  BLOCKED, // 4 - Tasks that cannot progress due to external dependencies or issues.
  DONE, // 5 - Tasks that are finished.
  ARCHIVED, // 6 - Tasks that are planned but not yet prioritized for immediate action.
  CANCELED, // 7 - Tasks that are no longer required.
  OVERDUE, // 8 - Tasks that are past their due date.
}

export enum TASK_PRIORITY {
  LOW,
  MEDIUM,
  HIGH,
}

export enum SORT_ORDER {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SORT_BY {
  TITLE = 'title',
  PRIORITY = 'priority',
  STATUS = 'status',
  START_DATE = 'startDate',
  DUE_DATE = 'dueDate',
  RECENTLY_UPDATED = 'recentlyUpdated',
}

export enum FILTER_BY {
  STATUS = 'status',
}

export interface Query {
  sortBy?: `${SORT_BY}`;
  sortOrder?: `${SORT_ORDER}`;
  filterBy?: `${FILTER_BY}`;
  filterValue?: string;
  search?: string;
}
