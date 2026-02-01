import { Router } from 'express';
import { ServiceController } from '../controllers/ServiceController';
import { ServiceService } from '../services/ServiceService';
import { ServiceRepository } from '../repositories/ServiceRepository';
import { ROUTES } from '../constants/routes';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '../enums/role';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Manual Dependency Injection
const serviceRepository = new ServiceRepository();
const serviceService = new ServiceService(serviceRepository);
const serviceController = new ServiceController(serviceService);

// Public Routes
router.get(ROUTES.SERVICES.GET_ALL, serviceController.getAllServices);
router.get(ROUTES.SERVICES.GET_BY_ID, serviceController.getServiceById);

// Admin Routes - with image upload
router.post(ROUTES.SERVICES.CREATE, authenticate, authorize(Role.ADMIN), upload.array('images', 5), serviceController.createService);
router.put(ROUTES.SERVICES.UPDATE, authenticate, authorize(Role.ADMIN), upload.array('images', 5), serviceController.updateService);
router.delete(ROUTES.SERVICES.DELETE, authenticate, authorize(Role.ADMIN), serviceController.deleteService);

export default router;
