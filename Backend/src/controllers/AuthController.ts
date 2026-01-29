import { Request, Response } from 'express';
import { IAuthService } from '../interface/services/IAuthService';
import { HTTP_STATUS } from '../constants/httpStatus';

export class AuthController {
    constructor(private authService: IAuthService) { }

    register = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.register(req.body);
            res.status(HTTP_STATUS.OK).json({ success: true, ...result });
        } catch (error: any) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: error.message });
        }
    };

    verify = async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body;
            const user = await this.authService.verifyOtp(email, otp);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Email verified successfully',
                data: user
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: error.message });
        }
    };

    resend = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const result = await this.authService.resendOtp(email);
            res.status(HTTP_STATUS.OK).json({ success: true, ...result });
        } catch (error: any) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: error.message });
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.login(req.body);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: error.message });
        }
    };

    adminLogin = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.adminLogin(req.body);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Admin login successful',
                data: result
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: error.message });
        }
    };
}
