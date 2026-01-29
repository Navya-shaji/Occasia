import { IUserService } from '../interface/services/IUserService';
import { IUserRepository } from '../interface/repositories/IUserRepository';
import { IUserResponse } from '../interface/user.interface';

export class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async getAllUsers(): Promise<IUserResponse[]> {
        return await this.userRepository.findAll();
    }

    async blockUser(userId: string): Promise<IUserResponse | null> {
        return await this.userRepository.updateById(userId, { isBlocked: true });
    }

    async unblockUser(userId: string): Promise<IUserResponse | null> {
        return await this.userRepository.updateById(userId, { isBlocked: false });
    }
}
