import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser, IUserResponse } from '../interface/user.interface';
import { IUserRepository } from '../interface/repositories/IUserRepository';
import { IAuthService } from '../interface/services/IAuthService';
import { ERROR_MESSAGES } from '../constants/errorMessages';
import { Role } from '../enums/role';
import { sendOtpEmail } from './mail.service';

export class AuthService implements IAuthService {
    constructor(private userRepository: IUserRepository) { }

    async register(userData: IUser) {
        const { name, email, password, role = Role.USER } = userData;

        if (role === Role.ADMIN) {
            throw new Error('Registration as ADMIN is not allowed');
        }

        if (!Object.values(Role).includes(role)) {
            throw new Error('Invalid role specified');
        }

        let user = await this.userRepository.findByEmail(email);

        if (user) {
            if (user.isVerified) {
                throw new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                user = await this.userRepository.updateByEmail(email, {
                    name,
                    password: hashedPassword,
                    role,
                    isVerified: true,
                    otp: undefined,
                    otpExpires: undefined
                }) as any;
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await this.userRepository.create({
                name,
                email,
                password: hashedPassword,
                role,
                isVerified: true
            }) as any;
        }

        const token = jwt.sign(
            { id: user!._id, name: user!.name, role: user!.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );

        return {
            id: user!._id,
            name: user!.name,
            email: user!.email,
            role: user!.role,
            token,
            message: 'Registration successful'
        };
    }

    async login(loginData: any) {
        const { email, password } = loginData;
        const user = await this.userRepository.findByEmail(email);

        if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

        // Prevent admin from logging in via user portal
        if (user.role === Role.ADMIN) {
            throw new Error('Admins must use the Admin Login portal');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) throw new Error('Invalid credentials');

        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );

        return { id: user._id, name: user.name, email: user.email, role: user.role, token };
    }

    async adminLogin(loginData: any) {
        const { email, password } = loginData;
        const user = await this.userRepository.findByEmail(email);

        if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        if (user.role !== Role.ADMIN) throw new Error('Access denied. Admin privileges required.');

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) throw new Error('Invalid credentials');

        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );

        return { id: user._id, name: user.name, email: user.email, role: user.role, token };
    }
}
