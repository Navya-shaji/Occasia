import { IUser, IUserResponse } from '../user.interface';

export interface IUserRepository {
    findByEmail(email: string): Promise<IUserResponse | null>;
    findById(id: string): Promise<IUserResponse | null>;
    create(userData: Partial<IUser>): Promise<IUserResponse>;
    update(email: string, userData: Partial<IUser>): Promise<IUserResponse | null>;
    findAll(page: number, limit: number): Promise<{ users: IUserResponse[]; total: number }>;
    updateById(id: string, userData: Partial<IUser>): Promise<IUserResponse | null>;
}
