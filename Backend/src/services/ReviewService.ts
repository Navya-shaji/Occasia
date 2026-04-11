import { ReviewRepository } from '../repositories/ReviewRepository';
import { IReviewDocument } from '../interface/review.interface';
import { BookingRepository } from '../repositories/BookingRepository';

export class ReviewService {
    constructor(
        private _reviewRepository: ReviewRepository,
        private _bookingRepository: BookingRepository
    ) { }

    async createReview(reviewData: Partial<IReviewDocument>): Promise<IReviewDocument> {
        // Check if booking exists and is completed
        const booking = await this._bookingRepository.findById(reviewData.booking as unknown as string);
        if (!booking) {
            throw new Error('Booking not found');
        }

        // Ideally check if status is 'Completed' or 'Confirmed' and date has passed
        // For simplicity, let's just check if it exists and matches the user
        if (booking.user.toString() !== reviewData.user?.toString()) {
            throw new Error('You are not authorized to review this booking');
        }

        // Check if review already exists
        const existingReview = await this._reviewRepository.findByBookingId(reviewData.booking as unknown as string);
        if (existingReview) {
            throw new Error('You have already reviewed this booking');
        }

        return await this._reviewRepository.create(reviewData);
    }

    async getReviewsByService(serviceId: string): Promise<IReviewDocument[]> {
        return await this._reviewRepository.findByServiceId(serviceId);
    }

    async getMyReviews(userId: string): Promise<IReviewDocument[]> {
        return await this._reviewRepository.findByUserId(userId);
    }
}
