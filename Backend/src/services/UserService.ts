import { IUserService } from '../interface/services/IUserService';
import { IUserRepository } from '../interface/repositories/IUserRepository';
import { IUserResponse } from '../interface/user.interface';

export class UserService implements IUserService {
    private _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    async getAllUsers(page: number, limit: number, search?: string, status?: string): Promise<{ users: IUserResponse[]; total: number }> {
        return await this._userRepository.findAllUsers(page, limit, search, status);
    }

    async blockUser(userId: string): Promise<IUserResponse | null> {
        return await this._userRepository.update(userId, { isBlocked: true });
    }

    async unblockUser(userId: string): Promise<IUserResponse | null> {
        return await this._userRepository.update(userId, { isBlocked: false });
    }
}
