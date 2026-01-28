import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { ROUTES } from '../constants/routes';

const router = Router();

// Dependency Injection manual wiring
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post(ROUTES.AUTH.REGISTER, authController.register);
router.post(ROUTES.AUTH.LOGIN, authController.login);
router.post(ROUTES.AUTH.VERIFY_OTP, authController.verify);
router.post(ROUTES.AUTH.RESEND_OTP, authController.resend);

export default router;
