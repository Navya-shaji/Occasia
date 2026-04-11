import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { ROUTES } from '../constants/routes';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Manual Dependency Injection
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Routes
router.use(authenticate);

router.get(ROUTES.WISHLIST.GET_ALL, userController.getWishlist);
router.post(ROUTES.WISHLIST.ADD, userController.addToWishlist);
router.delete(ROUTES.WISHLIST.REMOVE, userController.removeFromWishlist);

export default router;
