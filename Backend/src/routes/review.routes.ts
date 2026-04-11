import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { ReviewService } from '../services/ReviewService';
import { ReviewRepository } from '../repositories/ReviewRepository';
import { BookingRepository } from '../repositories/BookingRepository';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

const reviewRepository = new ReviewRepository();
const bookingRepository = new BookingRepository();
const reviewService = new ReviewService(reviewRepository, bookingRepository);
const reviewController = new ReviewController(reviewService);

router.post('/', authenticate, reviewController.createReview);
router.get('/service/:serviceId', reviewController.getReviewsByService);
router.get('/my', authenticate, reviewController.getMyReviews);

export default router;
