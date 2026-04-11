import { Document, Schema } from 'mongoose';

export interface IReview {
    user: Schema.Types.ObjectId;
    service: Schema.Types.ObjectId;
    booking: Schema.Types.ObjectId;
    rating: number;
    comment: string;
}

export interface IReviewDocument extends IReview, Document {
    createdAt: Date;
    updatedAt: Date;
}
