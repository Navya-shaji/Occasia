import { IUserResponse } from '../interface/user.interface';
import { UserResponseDto, AuthResponseDto } from '../dto/user.dto';

export const toUserResponseDto = (user: IUserResponse): UserResponseDto => ({
    id: user._id.toString(), // _id is expected to be present
    name: user.name,
    email: user.email,
    role: user.role!, // role is expected to be present
    isVerified: user.isVerified,
    isBlocked: user.isBlocked,
});

export const toAuthResponseDto = (user: IUserResponse, token: string, message?: string): AuthResponseDto => {
    const dto: AuthResponseDto = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role!,
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
