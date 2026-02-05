import { IUserResponse } from '../interface/user.interface';
import { UserResponseDto, AuthResponseDto } from '../dto/user.dto';

export class UserMapper {
    /**
     * Maps a User entity to UserResponseDto
     * Excludes sensitive information like password
     */
    static toUserResponseDto(user: IUserResponse): UserResponseDto {
        const dto = new UserResponseDto();
        dto.id = user._id.toString();
        dto.name = user.name;
        dto.email = user.email;
        dto.role = user.role!;
        dto.isVerified = user.isVerified;
        dto.isBlocked = user.isBlocked;
        return dto;
    }

    /**
     * Maps a User entity to AuthResponseDto with token
     */
    static toAuthResponseDto(user: IUserResponse, token: string, message?: string): AuthResponseDto {
        const dto = new AuthResponseDto();
        dto.id = user._id.toString();
        dto.name = user.name;
        dto.email = user.email;
        dto.role = user.role!;
        dto.token = token;
        if (message) {
            dto.message = message;
        }
        return dto;
    }

    /**
     * Maps multiple User entities to UserResponseDto array
     */
    static toUserResponseDtoList(users: IUserResponse[]): UserResponseDto[] {
        return users.map(user => this.toUserResponseDto(user));
    }
}
