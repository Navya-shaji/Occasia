import { Request, Response } from 'express';
import { registerUser, verifyOtp, resendOtp as resendOtpService } from '../services/auth.service';
import { HTTP_STATUS } from '../constants/httpStatus';
import { SUCCESS_MESSAGES } from '../constants/successMessages';

export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      ...result
    });
  } catch (error: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await verifyOtp(email, otp);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Email verified successfully',
      data: user
    });
  } catch (error: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
};

export const resend = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await resendOtpService(email);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      ...result
    });
  } catch (error: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
};


