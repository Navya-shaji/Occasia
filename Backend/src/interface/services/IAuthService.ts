import { IUser } from '../user.interface';

export interface IAuthService {
    register(userData: IUser): Promise<{ email: string; message: string }>;
    verifyOtp(email: string, otp: string): Promise<any>;
    resendOtp(email: string): Promise<{ message: string }>;
    login(loginData: any): Promise<any>;
    adminLogin(loginData: any): Promise<any>;
}
