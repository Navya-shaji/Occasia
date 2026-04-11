import { IUserService } from '../interface/services/IUserService';
import { IUserRepository } from '../interface/repositories/IUserRepository';
import { IUserResponse } from '../interface/user.interface';
import { UserResponseDto } from '../dto/user.dto';
import { toUserResponseDto, toUserResponseDtoList } from '../mappers/user.mapper';

export class UserService implements IUserService {
    private _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    async getAllUsers(page: number, limit: number, search?: string, status?: string): Promise<{ users: UserResponseDto[]; total: number }> {
        try {
            const result = await this._userRepository.findAllUsers(page, limit, search, status);

            // Filter out any null or invalid users
            const validUsers = result.users.filter(user => user && user._id);

            return {
                users: toUserResponseDtoList(validUsers),
                total: result.total
            };
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            throw error;
        }
    }

    async blockUser(userId: string): Promise<UserResponseDto | null> {
        const user = await this._userRepository.update(userId, { isBlocked: true });
        return user ? toUserResponseDto(user) : null;
    }

    async unblockUser(userId: string): Promise<UserResponseDto | null> {
        const user = await this._userRepository.update(userId, { isBlocked: false });
        return user ? toUserResponseDto(user) : null;
    }

    async addToWishlist(userId: string, serviceId: string): Promise<any> {
        return await this._userRepository.addToWishlist(userId, serviceId);
    }

    async removeFromWishlist(userId: string, serviceId: string): Promise<any> {
        return await this._userRepository.removeFromWishlist(userId, serviceId);
    }

    async getWishlist(userId: string): Promise<any[]> {
        return await this._userRepository.getWishlist(userId);
    }
}

