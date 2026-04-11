import mongoose, { Schema } from 'mongoose';
import { IServiceDocument } from '../interface/service.interface';

const ServiceSchema: Schema<IServiceDocument> = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        pricePerDay: {
            type: Number,
            required: true,
            min: 0
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            required: true,
            trim: true
        },
        images: {
            type: [String],
            default: []
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        unavailableDates: {
            type: [String],
            default: []
        },
        contactDetails: {
            phone: { type: String, required: true },
            email: { type: String, required: true },
            address: { type: String }
        },
        averageRating: {
            type: Number,
            default: 0
        },
        numReviews: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

export default mongoose.model<IServiceDocument>('Service', ServiceSchema);
