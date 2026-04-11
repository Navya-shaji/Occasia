import { IUser, IUserResponse } from '../user.interface';
import { IBaseRepository } from './IBaseRepository';
import { IUserDocument } from '../../models/user.model';

export interface IUserRepository extends IBaseRepository<IUserDocument> {
    findByEmail(email: string): Promise<IUserDocument | null>;
    updateByEmail(email: string, userData: Partial<IUser>): Promise<IUserDocument | null>;
    findAllUsers(page: number, limit: number, search?: string, status?: string): Promise<{ users: IUserResponse[]; total: number }>;
    addToWishlist(userId: string, serviceId: string): Promise<IUserDocument | null>;
    removeFromWishlist(userId: string, serviceId: string): Promise<IUserDocument | null>;
    getWishlist(userId: string): Promise<any[]>;
}
