import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '../enums/role';

const router = Router();

router.get('/profile', authenticate, (req, res) => {
    res.json({
        success: true,
        message: 'Profile data',
        user: req.user
    });
});

router.get('/admin/dashboard', authenticate, authorize(Role.ADMIN), (req, res) => {
    res.json({
        success: true,
        message: 'Admin dashboard data',
        user: req.user
    });
});



router.get('/events', authenticate, authorize(Role.USER), (req, res) => {
    res.json({
        success: true,
        message: 'Events data',
        user: req.user
    });
});

export default router;
