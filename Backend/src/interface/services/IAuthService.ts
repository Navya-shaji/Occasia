import { IUser } from '../user.interface';
import { AuthResponseDto } from '../../dto/user.dto';

export interface IAuthService {
    register(userData: IUser): Promise<AuthResponseDto>;
    login(loginData: any): Promise<AuthResponseDto>;
    adminLogin(loginData: any): Promise<AuthResponseDto>;
}

