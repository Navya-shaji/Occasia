import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { ROUTES } from '../constants/routes';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '../enums/role';

const router = Router();

// Manual Dependency Injection
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Routes
router.use(authenticate); 
router.use(authorize(Role.ADMIN)); 

router.get(ROUTES.USERS.GET_ALL, userController.getUsers);
router.patch(ROUTES.USERS.BLOCK, userController.blockUser);
router.patch(ROUTES.USERS.UNBLOCK, userController.unblockUser);

export default router;
