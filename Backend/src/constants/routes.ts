export const ROUTES = {
  API: {
    BASE: '/api',
    AUTH: '/auth'
  },

  AUTH: {
    REGISTER: '/register',
    LOGIN: '/login',
    VERIFY_OTP: '/verify-otp',
    RESEND_OTP: '/resend-otp',
    ADMIN_LOGIN: '/admin-login'
  },

  USERS: {
    base: '/users',
    GET_ALL: '/',
    BLOCK: '/:userId/block',
    UNBLOCK: '/:userId/unblock'
  },

  SERVICES: {
    BASE: '/services',
    GET_ALL: '/',
    GET_BY_ID: '/:id',
    CREATE: '/',
    UPDATE: '/:id',
    DELETE: '/:id'
  },
  BOOKINGS: {
    BASE: '/bookings',
    CREATE: '/',
    GET_MY: '/my',
    GET_ALL: '/all',
    CANCEL: '/:id/cancel',
    UPDATE_STATUS: '/:id/status'
  }
} as const;
