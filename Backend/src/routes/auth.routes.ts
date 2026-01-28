import { Router } from 'express';
import { register, verify, resend } from '../controllers/auth.controller';
import { ROUTES } from '../constants/routes';

const router = Router();

router.post(ROUTES.AUTH.REGISTER, register);
router.post(ROUTES.AUTH.VERIFY_OTP, verify);
router.post(ROUTES.AUTH.RESEND_OTP, resend);

export default router;
