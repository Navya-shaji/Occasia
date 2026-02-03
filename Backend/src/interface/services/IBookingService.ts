import { IBooking, IBookingDocument } from '../booking.interface';

export interface IBookingService {
    createBooking(userId: string, serviceId: string, startDate: string, endDate: string): Promise<IBookingDocument>;
    getUserBookings(userId: string): Promise<IBookingDocument[]>;
    getAllBookings(): Promise<IBookingDocument[]>;
    cancelBooking(bookingId: string, userId: string): Promise<IBookingDocument>;
    getBookingById(bookingId: string, userId: string): Promise<IBookingDocument | null>;
    updateBookingStatus(bookingId: string, status: string): Promise<IBookingDocument>;
}
