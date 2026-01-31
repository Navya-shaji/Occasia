import { Document, Schema } from 'mongoose';

export interface IBooking {
    user: Schema.Types.ObjectId;
    service: Schema.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    bookingDate: Date;
}

export interface IBookingDocument extends IBooking, Document {
    createdAt: Date;
    updatedAt: Date;
}
