import { IUser } from '../user.interface';

export interface IAuthService {
    register(userData: IUser): Promise<any>;
    login(loginData: any): Promise<any>;
    adminLogin(loginData: any): Promise<any>;
}
