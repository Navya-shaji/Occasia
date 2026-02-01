import { IUserService } from '../interface/services/IUserService';
import { IUserRepository } from '../interface/repositories/IUserRepository';
import { IUserResponse } from '../interface/user.interface';

export class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async getAllUsers(page: number, limit: number, search?: string, status?: string): Promise<{ users: IUserResponse[]; total: number }> {
        return await this.userRepository.findAll(page, limit, search, status);
    }

    async blockUser(userId: string): Promise<IUserResponse | null> {
        return await this.userRepository.updateById(userId, { isBlocked: true });
    }

    async unblockUser(userId: string): Promise<IUserResponse | null> {
        return await this.userRepository.updateById(userId, { isBlocked: false });
    }
}
