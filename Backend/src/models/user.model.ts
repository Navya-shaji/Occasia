import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interface/user.interface';
import { Role } from '../enums/role';


export interface IUserDocument extends IUser, Document { }

const UserSchema: Schema<IUserDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER
    },
    otp: {
      type: String,
      default: null
    },
    otpExpires: {
      type: Date,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUserDocument>('User', UserSchema);
