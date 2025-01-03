export enum ACCOUNT_TYPE {
  CREDENTIALS,
  GOOGLE,
}

export enum TASK_STATUS {
  TODO, // 0 - Tasks that are ready to be worked on.
  IN_PROGRESS, // 1 - Tasks currently being worked on.
  BLOCKED, // 2 - Tasks that cannot progress due to external dependencies or issues.
  ON_HOLD, // 3 - Tasks that are temporarily paused.
  REVIEW, // 4 - Tasks completed but waiting for review or approval.
  DONE, // 5 - Tasks that are finished.
  ARCHIVED, // 6 - Tasks that are planned but not yet prioritized for immediate action.
  CANCELED, // 7 - Tasks that are no longer required.
}

export enum SORT_ORDER {
  ASC = 'asc',
  DESC = 'desc',
}

export enum SORT_BY {
  TITLE = 'title',
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
