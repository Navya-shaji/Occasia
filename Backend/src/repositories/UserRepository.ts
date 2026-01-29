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



    async findAll(page: number, limit: number, search?: string, status?: string): Promise<{ users: IUserResponse[]; total: number }> {
        const skip = (page - 1) * limit;
        const query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (status && status !== 'all') {
            query.isBlocked = status === 'blocked';
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 });
        return { users, total };
    }

    async updateById(id: string, userData: Partial<IUser>): Promise<IUserResponse | null> {
        return await User.findByIdAndUpdate(id, userData, { new: true });
    }
}
