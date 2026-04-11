import { BaseRepository } from './BaseRepository';
import Review from '../models/review.model';
import { IReviewDocument } from '../interface/review.interface';

export class ReviewRepository extends BaseRepository<IReviewDocument> {
    constructor() {
        super(Review);
    }

    async findByServiceId(serviceId: string): Promise<IReviewDocument[]> {
        return await this._model.find({ service: serviceId }).populate('user', 'name email').sort({ createdAt: -1 });
    }

    async findByUserId(userId: string): Promise<IReviewDocument[]> {
        return await this._model.find({ user: userId }).populate('service', 'name images');
    }

    async findByBookingId(bookingId: string): Promise<IReviewDocument | null> {
        return await this._model.findOne({ booking: bookingId });
    }
}
