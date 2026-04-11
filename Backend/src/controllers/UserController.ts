import { Request, Response } from 'express';
import { IUserService } from '../interface/services/IUserService';
import { HTTP_STATUS } from '../constants/httpStatus';

export class UserController {
    constructor(private _userService: IUserService) { }

    getUsers = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string || '';
            const status = req.query.status as string || 'all';

            const result = await this._userService.getAllUsers(page, limit, search, status);

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
            const updatedUser = await this._userService.blockUser(userId as string);
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
            const updatedUser = await this._userService.unblockUser(userId as string);
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

    addToWishlist = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const { serviceId } = req.body;
            await this._userService.addToWishlist(userId, serviceId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Added to wishlist'
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error adding to wishlist'
            });
        }
    };

    removeFromWishlist = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const { serviceId } = req.params;
            await this._userService.removeFromWishlist(userId, serviceId as string);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Removed from wishlist'
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error removing from wishlist'
            });
        }
    };

    getWishlist = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const wishlist = await this._userService.getWishlist(userId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Wishlist fetched successfully',
                data: wishlist
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error fetching wishlist'
            });
        }
    };
}
