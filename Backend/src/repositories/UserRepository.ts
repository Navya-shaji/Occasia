import User from '../models/user.model';
import { IUser, IUserResponse } from '../interface/user.interface';
import { IUserRepository } from '../interface/repositories/IUserRepository';

export class UserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<IUserResponse | null> {
        return await User.findOne({ email });
    }

    async findById(id: string): Promise<IUserResponse | null> {
        return await User.findById(id);
    }

    async create(userData: Partial<IUser>): Promise<IUserResponse> {
        return await User.create(userData);
    }

    async update(email: string, userData: Partial<IUser>): Promise<IUserResponse | null> {
        return await User.findOneAndUpdate({ email }, userData, { new: true });
    }
}
