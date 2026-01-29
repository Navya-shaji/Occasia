import { Router } from 'express';
import { ServiceController } from '../controllers/ServiceController';
import { ServiceService } from '../services/ServiceService';
import { ServiceRepository } from '../repositories/ServiceRepository';
import { ROUTES } from '../constants/routes';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '../enums/role';

const router = Router();

// Manual Dependency Injection
const serviceRepository = new ServiceRepository();
const serviceService = new ServiceService(serviceRepository);
const serviceController = new ServiceController(serviceService);

// Public Routes
router.get(ROUTES.SERVICES.GET_ALL, serviceController.getAllServices);
router.get(ROUTES.SERVICES.GET_BY_ID, serviceController.getServiceById);

// Admin Routes
router.post(ROUTES.SERVICES.CREATE, authenticate, authorize(Role.ADMIN), serviceController.createService);
router.put(ROUTES.SERVICES.UPDATE, authenticate, authorize(Role.ADMIN), serviceController.updateService);
router.delete(ROUTES.SERVICES.DELETE, authenticate, authorize(Role.ADMIN), serviceController.deleteService);

export default router;
