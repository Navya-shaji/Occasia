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

    private generateOtp(): string {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp;
    }

    async register(userData: IUser) {
        const { name, email, password, role = Role.USER } = userData;

        if (role === Role.ADMIN) {
            throw new Error('Registration as ADMIN is not allowed');
        }

        if (!Object.values(Role).includes(role)) {
            throw new Error('Invalid role specified');
        }

        const existingUser = await this.userRepository.findByEmail(email);
        const otp = this.generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        if (existingUser) {
            if (existingUser.isVerified) {
                throw new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                await this.userRepository.update(email, {
                    name,
                    password: hashedPassword,
                    role,
                    otp,
                    otpExpires
                });
                await sendOtpEmail(email, otp);
                return { email, message: `OTP sent for ${role.toLowerCase()} verification` };
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            role,
            otp,
            otpExpires,
            isVerified: false
        });

        await sendOtpEmail(email, otp);
        return { email, message: `OTP sent for ${role.toLowerCase()} verification` };
    }

    async verifyOtp(email: string, otp: string) {
        const user = await this.userRepository.findByEmail(email);

        if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        if (user.isVerified) throw new Error('User already verified');
        if (user.otp !== otp) throw new Error('Invalid OTP');
        if (user.otpExpires && user.otpExpires < new Date()) throw new Error('OTP expired');

        await this.userRepository.update(email, {
            isVerified: true,
            otp: undefined,
            otpExpires: undefined
        });

        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );

        return { id: user._id, name: user.name, email: user.email, role: user.role, token };
    }

    async resendOtp(email: string) {
        const user = await this.userRepository.findByEmail(email);

        if (!user) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
        if (user.isVerified) throw new Error('User already verified');

        const otp = this.generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await this.userRepository.update(email, { otp, otpExpires });
        await sendOtpEmail(email, otp);

        return { message: 'OTP resent successfully' };
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
