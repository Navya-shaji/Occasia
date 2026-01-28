import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { ROUTES } from '../constants/routes';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema, verifyOtpSchema, resendOtpSchema } from '../validations/auth.validation';

const router = Router();

// Dependency Injection manual wiring
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post(ROUTES.AUTH.REGISTER, validate(registerSchema), authController.register);
router.post(ROUTES.AUTH.LOGIN, validate(loginSchema), authController.login);
router.post(ROUTES.AUTH.VERIFY_OTP, validate(verifyOtpSchema), authController.verify);
router.post(ROUTES.AUTH.RESEND_OTP, validate(resendOtpSchema), authController.resend);

export default router;
