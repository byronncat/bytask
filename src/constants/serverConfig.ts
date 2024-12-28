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
  FORGOT_PASSWORD: '/forgot-password',

  // Protected
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  BOARD_VIEW: '/board',
  CALENDAR_VIEW: '/calendar',
  TALBE_VIEW: '/table',
  STATISTICS: '/statistics',
};

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET || 'secret';
export const ENCODED_KEY = new TextEncoder().encode(SECRET_KEY);

export const HOST_URL =
  process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3000';
export const SERVER_API = `${HOST_URL}/api`;
