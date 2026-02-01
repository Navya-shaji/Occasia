import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';
import { BookingService } from '../services/BookingService';
import { BookingRepository } from '../repositories/BookingRepository';
import { ServiceRepository } from '../repositories/ServiceRepository';
import { UserRepository } from '../repositories/UserRepository';
import { ROUTES } from '../constants/routes';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { Role } from '../enums/role';

const router = Router();

// Manual Dependency Injection
const bookingRepository = new BookingRepository();
const serviceRepository = new ServiceRepository();
const userRepository = new UserRepository();
const bookingService = new BookingService(bookingRepository, serviceRepository, userRepository);
const bookingController = new BookingController(bookingService);

// User Routes
router.post(ROUTES.BOOKINGS.CREATE, authenticate, bookingController.createBooking);
router.get(ROUTES.BOOKINGS.GET_MY, authenticate, bookingController.getUserBookings);
router.get(ROUTES.BOOKINGS.GET_BY_ID, authenticate, bookingController.getBookingById);
router.post(ROUTES.BOOKINGS.CANCEL, authenticate, bookingController.cancelBooking);

// Admin Routes
router.get(ROUTES.BOOKINGS.GET_ALL, authenticate, authorize(Role.ADMIN), bookingController.getAllBookings);
router.patch(ROUTES.BOOKINGS.UPDATE_STATUS, authenticate, authorize(Role.ADMIN), bookingController.updateStatus);

export default router;
