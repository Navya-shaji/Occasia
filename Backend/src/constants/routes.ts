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
  }
} as const;
