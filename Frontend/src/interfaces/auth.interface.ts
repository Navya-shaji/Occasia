export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role: 'USER' | 'VENDOR';
}


export interface AuthResponse {
    success: boolean;
    message?: string;
    data?: any;
}
