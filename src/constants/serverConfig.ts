export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
};

export const ROUTE = {
  // Guest
  LANDING: '/',

  // Auth
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Protected
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  TALBE_VIEW: '/table',
  CALENDAR_VIEW: '/calendar',
  CARD_VIEW: '/card',
  TASK: '/task',
  CREATE_TASK: '/task/create',
  POMODORO: '/pomodoro',
  TIMER_SESSION: '/timer-session',
};

const SECRET_KEY = process.env.SECRET || 'secret';
export const ENCODED_KEY = new TextEncoder().encode(SECRET_KEY);

export const HOST_URL =
  process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3000';
export const SERVER_API = `${HOST_URL}/api`;
export const AI_KEY = process.env.AI_API_KEY || 'http://localhost:3000';
