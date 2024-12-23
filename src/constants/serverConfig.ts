export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const ROUTE = {
  // Guest
  LANDING: '/',

  // Auth
  LOGIN: '/login',
  SIGNUP: '/signup',

  // Protected
  DASHBOARD: '/dashboard',
  BOARD_VIEW: '/board',
  CALENDAR_VIEW: '/calendar',
  TALBE_VIEW: '/table',
  STATISTICS: '/statistics',
};
