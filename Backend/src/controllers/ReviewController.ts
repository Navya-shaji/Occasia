import { Request, Response } from 'express';
import { ReviewService } from '../services/ReviewService';
import { HTTP_STATUS } from '../constants/httpStatus';

export class ReviewController {
    constructor(private _reviewService: ReviewService) { }

    createReview = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const reviewData = { ...req.body, user: userId };

            const review = await this._reviewService.createReview(reviewData);

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Review submitted successfully',
                data: review
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: error.message || 'Error submitting review'
            });
        }
    };

    getReviewsByService = async (req: Request, res: Response) => {
        try {
            const { serviceId } = req.params;
            const reviews = await this._reviewService.getReviewsByService(serviceId as string);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Reviews fetched successfully',
                data: reviews
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error fetching reviews'
            });
        }
    };

    getMyReviews = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const reviews = await this._reviewService.getMyReviews(userId);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'My reviews fetched successfully',
                data: reviews
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error fetching reviews'
            });
        }
    };
}
