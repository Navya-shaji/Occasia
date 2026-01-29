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
    }
};

export const APP_ROUTES = {
    REGISTER: '/register',
    VERIFY_OTP: '/verify-otp',
    DASHBOARD: '/dashboard',
    LOGIN: '/login',
    ADMIN_LOGIN: '/admin/login',
    ADMIN_DASHBOARD: '/admin/dashboard',
};
