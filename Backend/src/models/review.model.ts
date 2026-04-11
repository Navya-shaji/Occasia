import mongoose, { Schema } from 'mongoose';
import { IReviewDocument } from '../interface/review.interface';

const ReviewSchema: Schema<IReviewDocument> = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        service: {
            type: Schema.Types.ObjectId,
            ref: 'Service',
            required: true
        },
        booking: {
            type: Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
            unique: true // One review per booking
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        }
    },
    { timestamps: true }
);

// Statics method to calculate average rating
ReviewSchema.statics.calculateAverageRating = async function (serviceId: mongoose.Types.ObjectId) {
    const stats = await this.aggregate([
        {
            $match: { service: serviceId }
        },
        {
            $group: {
                _id: '$service',
                numReviews: { $sum: 1 },
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('Service').findByIdAndUpdate(serviceId, {
            numReviews: stats[0].numReviews,
            averageRating: Math.round(stats[0].averageRating * 10) / 10
        });
    } else {
        await mongoose.model('Service').findByIdAndUpdate(serviceId, {
            numReviews: 0,
            averageRating: 0
        });
    }
};

// Call calculateAverageRating after save
ReviewSchema.post('save', function () {
    (this.constructor as any).calculateAverageRating(this.service);
});

// Call calculateAverageRating before delete
ReviewSchema.post('deleteOne', { document: true, query: false }, function () {
    (this.constructor as any).calculateAverageRating(this.service);
});

export default mongoose.model<IReviewDocument>('Review', ReviewSchema);
