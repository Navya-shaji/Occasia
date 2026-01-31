import Booking from '../models/booking.model';
import { IBooking, IBookingDocument } from '../interface/booking.interface';
import { IBookingRepository } from '../interface/repositories/IBookingRepository';

export class BookingRepository implements IBookingRepository {
    async create(bookingData: Partial<IBooking>): Promise<IBookingDocument> {
        return await Booking.create(bookingData);
    }

    async findById(id: string): Promise<IBookingDocument | null> {
        return await Booking.findById(id).populate('service').populate('user');
    }

    async findAll(query: any = {}): Promise<IBookingDocument[]> {
        return await Booking.find(query).populate('service').populate('user').sort({ createdAt: -1 });
    }

    async findByUserId(userId: string): Promise<IBookingDocument[]> {
        return await Booking.find({ user: userId }).populate('service').sort({ createdAt: -1 });
    }

    async updateStatus(id: string, status: string): Promise<IBookingDocument | null> {
        return await Booking.findByIdAndUpdate(id, { status }, { new: true });
    }
}
