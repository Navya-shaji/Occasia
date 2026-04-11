export const API_ROUTES = {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ADMIN_LOGIN: '/auth/admin-login',
    USERS: {
        GET_ALL: '/users',
        BLOCK: '/users/:id/block',
        UNBLOCK: '/users/:id/unblock'
    },
    SERVICES: {
        BASE: '/services',
        GET_ALL: '/services',
        GET_BY_ID: '/services/:id',
        CREATE: '/services',
        UPDATE: '/services/:id',
        DELETE: '/services/:id'
    },
    BOOKINGS: {
        BASE: '/bookings',
        CREATE: '/bookings',
        GET_MY: '/bookings/my',
        GET_BY_ID: '/bookings/:id',
        GET_ALL: '/bookings/all',
        CANCEL: '/bookings/:id/cancel',
        UPDATE_STATUS: '/bookings/:id/status'
    },
    REVIEWS: {
        CREATE: '/reviews',
        GET_BY_SERVICE: '/reviews/service/:serviceId',
        GET_MY: '/reviews/my'
    },
    WISHLIST: {
        GET_ALL: '/wishlist',
        ADD: '/wishlist',
        REMOVE: '/wishlist/:serviceId'
    }
};

export const APP_ROUTES = {
    HOME: '/',
    REGISTER: '/register',
    LOGIN: '/login',
    ADMIN_LOGIN: '/admin/login',
    ADMIN_DASHBOARD: '/admin',
    SERVICES: '/services',
    SERVICE_DETAILS: '/services/:id',
    MY_BOOKINGS: '/my-bookings',
    BOOKING_DETAILS: '/bookings/:id',
    WISHLIST: '/wishlist',
};
