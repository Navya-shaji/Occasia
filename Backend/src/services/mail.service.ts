import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verification Code for Occasia',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Welcome to Occasia</h2>
        <p style="font-size: 16px; color: #555;">Hi there,</p>
        <p style="font-size: 16px; color: #555;">Thank you for registering with Occasia. To complete your registration, please use the following OTP code:</p>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <h1 style="letter-spacing: 5px; color: #000; margin: 0;">${otp}</h1>
        </div>
        <p style="font-size: 14px; color: #777;">This code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2026 Occasia. All rights reserved.</p>
      </div>
    `,
  };

  try {
    // Log OTP to console for easy development access
    console.log('\n=======================================');
    console.log('📧  DEVELOPMENT OTP:', otp);
    console.log('👤  SENT TO:', email);
    console.log('=======================================\n');

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending email (Gmail AUTH failure), but check the console above for the OTP!:', error);
    // We don't throw the error here in development so the user can still proceed
    // throw new Error('Failed to send verification email');
  }
};
