import { Role } from "../enums/role";

// Request DTOs
export class RegisterUserDto {
    name!: string;
    email!: string;
    password!: string;
    role?: Role;
}

export class LoginUserDto {
    email!: string;
    password!: string;
}

export class UpdateUserDto {
    name?: string;
    email?: string;
    isBlocked?: boolean;
}

// Response DTOs
export class UserResponseDto {
    id!: string;
    name!: string;
    email!: string;
    role!: Role;
    isVerified?: boolean;
    isBlocked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class AuthResponseDto {
    id!: string;
    name!: string;
    email!: string;
    role!: Role;
    token!: string;
    message?: string;
}
