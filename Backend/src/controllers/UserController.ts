import { Request, Response } from 'express';
import { IUserService } from '../interface/services/IUserService';
import { HTTP_STATUS } from '../constants/httpStatus';

export class UserController {
    constructor(private userService: IUserService) { }

    getUsers = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string || '';
            const status = req.query.status as string || 'all';

            const result = await this.userService.getAllUsers(page, limit, search, status);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Users fetched successfully',
                data: result.users,
                total: result.total,
                page,
                limit
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error fetching users'
            });
        }
    };

    blockUser = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const updatedUser = await this.userService.blockUser(userId as string);
            if (!updatedUser) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'User not found' });
            }
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'User blocked successfully',
                data: updatedUser
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error blocking user'
            });
        }
    };

    unblockUser = async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const updatedUser = await this.userService.unblockUser(userId as string);
            if (!updatedUser) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'User not found' });
            }
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'User unblocked successfully',
                data: updatedUser
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error unblocking user'
            });
        }
    };
}
