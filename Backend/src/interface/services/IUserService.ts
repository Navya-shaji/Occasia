import { IUserResponse } from '../user.interface';
import { UserResponseDto } from '../../dto/user.dto';

export interface IUserService {
    getAllUsers(page: number, limit: number, search?: string, status?: string): Promise<{ users: UserResponseDto[]; total: number }>;
    blockUser(userId: string): Promise<UserResponseDto | null>;
    unblockUser(userId: string): Promise<UserResponseDto | null>;
    addToWishlist(userId: string, serviceId: string): Promise<any>;
    removeFromWishlist(userId: string, serviceId: string): Promise<any>;
    getWishlist(userId: string): Promise<any[]>;
}

