export const API_ROUTES = {
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
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
    }
};

export const APP_ROUTES = {
    REGISTER: '/register',
    VERIFY_OTP: '/verify-otp',
    DASHBOARD: '/dashboard',
    LOGIN: '/login',
    ADMIN_LOGIN: '/admin/login',
    ADMIN_DASHBOARD: '/admin',
    SERVICES: '/services',
    SERVICE_DETAILS: '/services/:id',
    MY_BOOKINGS: '/my-bookings',
    BOOKING_DETAILS: '/bookings/:id',
};
