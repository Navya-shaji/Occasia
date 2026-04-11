export const ROUTES = {
  API: {
    BASE: '/api',
    AUTH: '/auth'
  },

  AUTH: {
    REGISTER: '/register',
    LOGIN: '/login',
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
    GET_BY_ID: '/:id',
    GET_ALL: '/all',
    CANCEL: '/:id/cancel',
    UPDATE_STATUS: '/:id/status'
  },
  REVIEWS: {
    BASE: '/reviews',
    CREATE: '/',
    GET_BY_SERVICE: '/service/:serviceId',
    GET_MY: '/my'
  },
  WISHLIST: {
    BASE: '/wishlist',
    GET_ALL: '/',
    ADD: '/',
    REMOVE: '/:serviceId'
  }
} as const;
