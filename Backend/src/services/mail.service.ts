import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000, // 10s
  greetingTimeout: 10000,
  socketTimeout: 10000,
});





export const sendOtpEmail = async (email: string, otp: string) => {
  // 1. LOG TO CONSOLE IMMEDIATELY
  console.log('\n\n\n');
  console.log('**************************************************');
  console.log('**********       OCCASIA OTP LOG        **********');
  console.log('**************************************************');
  console.log(`|  CODE:    ${otp}                          |`);
  console.log(`|  EMAIL:   ${email}               |`);
  console.log('**************************************************');
  console.log('>>> CHECK ABOVE FOR THE OTP CODE <<<\n\n\n');

  try {
    await transporter.verify();
console.log("✅ Gmail SMTP is ready");

    const filePath = path.join(process.cwd(), 'LATEST_OTP.txt');
    fs.writeFileSync(filePath, `EMAIL: ${email}\nOTP: ${otp}\nTIME: ${new Date().toLocaleString()}`);
  } catch (err) {
    // Ignore file write errors
  }

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
    // 3. ATTEMPT MAIL (Might fail if App Password in .env is incorrect)
    await transporter.sendMail(mailOptions);
    console.log(`✅ Success: OTP email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Gmail Error: The email could not be sent to ${email}.`);
    console.error(`   Reason: ${(error as any).message}`);
    console.log('   (If you are in development, you can use the OTP logged above)');
    console.log('   (To fix email sending, update EMAIL_USER and EMAIL_PASS in backend/.env with valid Gmail App Password credentials)');
  }
};

export const sendBookingConfirmation = async (email: string, bookingDetails: any) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Booking Confirmed: ${bookingDetails.serviceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #6366f1; text-align: center;">Booking Confirmation</h2>
        <p style="font-size: 16px; color: #555;">Hi there,</p>
        <p style="font-size: 16px; color: #555;">We are excited to confirm your booking for <strong>${bookingDetails.serviceName}</strong>.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Timeline:</strong> ${bookingDetails.startDate} to ${bookingDetails.endDate}</p>
            <p style="margin: 5px 0;"><strong>Total Valuation:</strong> $${bookingDetails.totalPrice}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> ${bookingDetails.status}</p>
        </div>

        <p style="font-size: 14px; color: #777;">Our concierge team will reach out to you shortly to discuss further details.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2026 Occasia Prestige Services.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Success: Booking confirmation sent to ${email}`);
  } catch (error) {
    console.log(`❌ Error: Could not send booking confirmation to ${email}`);
  }
};
