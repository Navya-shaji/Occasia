import mongoose, { Schema } from 'mongoose';
import { IBookingDocument } from '../interface/booking.interface';

const BookingSchema: Schema<IBookingDocument> = new Schema(
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
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
            default: 'PENDING'
        },
        bookingDate: {
            type: Date,
            default: Date.now
        },
        serviceName: {
            type: String,
            required: true
        },
        serviceImage: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model<IBookingDocument>('Booking', BookingSchema);
