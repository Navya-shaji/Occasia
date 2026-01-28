import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { IUser } from '../interface/user.interface';
import { ERROR_MESSAGES } from '../constants/errorMessages';
import { Role } from '../enums/role';


import { sendOtpEmail } from './mail.service';

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const registerUser = async (userData: IUser) => {
  const { name, email, password, role = Role.USER } = userData;

  // Branching: Validate role
  if (role === Role.ADMIN) {
    throw new Error('Registration as ADMIN is not allowed');
  }

  // Check if role is valid
  if (!Object.values(Role).includes(role)) {
    throw new Error('Invalid role specified');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.isVerified) {
      throw new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    } else {
      // If user exists but not verified, we can update their details and send new OTP
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOtp();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.role = role; // Update role if changed
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      await existingUser.save();

      await sendOtpEmail(email, otp);
      return { email, message: `OTP sent for ${role.toLowerCase()} verification` };
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    otp,
    otpExpires,
    isVerified: false
  });

  await sendOtpEmail(email, otp);

  return {
    email: user.email,
    message: `OTP sent for ${role.toLowerCase()} verification`
  };
};

export const verifyOtp = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  if (user.isVerified) {
    throw new Error('User already verified');
  }

  if (user.otp !== otp) {
    throw new Error('Invalid OTP');
  }

  if (user.otpExpires && user.otpExpires < new Date()) {
    throw new Error('OTP expired');
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

export const resendOtp = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  if (user.isVerified) {
    throw new Error('User already verified');
  }

  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  await sendOtpEmail(email, otp);

  return { message: 'OTP resent successfully' };
};

