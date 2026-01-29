import { Role } from "../enums/role";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: Role;
  otp?: string;
  otpExpires?: Date;
  isVerified?: boolean;
  isBlocked?: boolean;
}

export interface IUserResponse extends IUser {
  _id: any;
}
