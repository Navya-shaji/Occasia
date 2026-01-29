import apiInstance from '../api/apiInstance';
import { API_ROUTES } from '../constants/routes';

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role: 'USER' | 'VENDOR';
}

export interface VerifyOtpPayload {
    email: string;
    otp: string;
}

export interface ResendOtpPayload {
    email: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

const authService = {
    register: async (payload: RegisterPayload) => {
        const response = await apiInstance.post(API_ROUTES.REGISTER, payload);
        return response.data;
    },

    verifyOtp: async (payload: VerifyOtpPayload) => {
        const response = await apiInstance.post(API_ROUTES.VERIFY_OTP, payload);
        return response.data;
    },

    resendOtp: async (payload: ResendOtpPayload) => {
        const response = await apiInstance.post(API_ROUTES.RESEND_OTP, payload);
        return response.data;
    },

    login: async (payload: LoginPayload) => {
        const response = await apiInstance.post(API_ROUTES.LOGIN, payload);
        return response.data;
    },

    adminLogin: async (payload: LoginPayload) => {
        const response = await apiInstance.post(API_ROUTES.ADMIN_LOGIN, payload);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
};

export default authService;
