import { IUserResponse } from '../interface/user.interface';
import { UserResponseDto, AuthResponseDto } from '../dto/user.dto';

import { Role } from '../enums/role';

export const toUserResponseDto = (user: IUserResponse): UserResponseDto => {
    return {
        id: user._id ? user._id.toString() : '',
        name: user.name || '',
        email: user.email || '',
        role: user.role || Role.USER,
        isVerified: !!user.isVerified,
        isBlocked: !!user.isBlocked,
    };
};

export const toAuthResponseDto = (user: IUserResponse, token: string, message?: string): AuthResponseDto => {
    const dto: AuthResponseDto = {
        id: user._id ? user._id.toString() : '',
        name: user.name || '',
        email: user.email || '',
        role: user.role || Role.USER,
        token,
    };
    if (message) {
        dto.message = message;
    }
    return dto;
};

export const toUserResponseDtoList = (users: IUserResponse[]): UserResponseDto[] => {
    return users.map(toUserResponseDto);
};
