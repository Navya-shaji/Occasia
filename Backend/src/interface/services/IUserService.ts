import { IUserResponse } from '../user.interface';

export interface IUserService {
    getAllUsers(page: number, limit: number): Promise<{ users: IUserResponse[]; total: number }>;
    blockUser(userId: string): Promise<IUserResponse | null>;
    unblockUser(userId: string): Promise<IUserResponse | null>;
}
