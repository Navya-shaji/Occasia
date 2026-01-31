import { IBooking, IBookingDocument } from '../booking.interface';

export interface IBookingRepository {
    create(bookingData: Partial<IBooking>): Promise<IBookingDocument>;
    findById(id: string): Promise<IBookingDocument | null>;
    findAll(query?: any): Promise<IBookingDocument[]>;
    findByUserId(userId: string): Promise<IBookingDocument[]>;
    updateStatus(id: string, status: string): Promise<IBookingDocument | null>;
}
