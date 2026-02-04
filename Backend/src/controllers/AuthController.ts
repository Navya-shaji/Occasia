import { Request, Response } from 'express';
import { IAuthService } from '../interface/services/IAuthService';
import { HTTP_STATUS } from '../constants/httpStatus';

export class AuthController {
    constructor(private _authService: IAuthService) { }

    register = async (req: Request, res: Response) => {
        try {
            const result = await this._authService.register(req.body);
            res.status(HTTP_STATUS.OK).json({ success: true, ...result });
        } catch (error: any) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: error.message });
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const result = await this._authService.login(req.body);
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
            const result = await this._authService.adminLogin(req.body);
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
