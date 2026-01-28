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

export interface AuthResponse {
    success: boolean;
    message?: string;
    data?: any;
}
