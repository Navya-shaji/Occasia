import User, { IUserDocument } from '../models/user.model';
import { IUser, IUserResponse } from '../interface/user.interface';
import { IUserRepository } from '../interface/repositories/IUserRepository';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository<IUserDocument> implements IUserRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email: string): Promise<IUserDocument | null> {
        return await this._model.findOne({ email });
    }

    async updateByEmail(email: string, userData: Partial<IUser>): Promise<IUserDocument | null> {
        return await this._model.findOneAndUpdate({ email }, userData, { new: true });
    }

    async findAllUsers(page: number, limit: number, search?: string, status?: string): Promise<{ users: IUserResponse[]; total: number }> {
        const skip = (page - 1) * limit;
        const query: any = { role: 'USER' };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (status && status !== 'all') {
            query.isBlocked = status === 'blocked';
        }

        const total = await this._model.countDocuments(query);
        const users = await this._model.find(query).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 });
        return { users, total };
    }

    async addToWishlist(userId: string, serviceId: string): Promise<IUserDocument | null> {
        return await this._model.findByIdAndUpdate(userId, { $addToSet: { wishlist: serviceId } }, { new: true });
    }

    async removeFromWishlist(userId: string, serviceId: string): Promise<IUserDocument | null> {
        return await this._model.findByIdAndUpdate(userId, { $pull: { wishlist: serviceId } }, { new: true });
    }

    async getWishlist(userId: string): Promise<any[]> {
        const user = await this._model.findById(userId).populate('wishlist');
        return user?.wishlist || [];
    }
}
