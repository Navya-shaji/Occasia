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
        const result = await this._userRepository.findAllUsers(page, limit, search, status);
        return {
            users: toUserResponseDtoList(result.users),
            total: result.total
        };
    }

    async blockUser(userId: string): Promise<UserResponseDto | null> {
        const user = await this._userRepository.update(userId, { isBlocked: true });
        return user ? toUserResponseDto(user) : null;
    }

    async unblockUser(userId: string): Promise<UserResponseDto | null> {
        const user = await this._userRepository.update(userId, { isBlocked: false });
        return user ? toUserResponseDto(user) : null;
    }
}

