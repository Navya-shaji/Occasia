import { IBooking, IBookingDocument } from '../booking.interface';
import { BookingResponseDto } from '../../dto/booking.dto';

export interface IBookingService {
    createBooking(userId: string, serviceId: string, startDate: string, endDate: string): Promise<BookingResponseDto>;
    getUserBookings(userId: string): Promise<BookingResponseDto[]>;
    getAllBookings(): Promise<BookingResponseDto[]>;
    cancelBooking(bookingId: string, userId: string): Promise<BookingResponseDto>;
    getBookingById(bookingId: string, userId: string): Promise<BookingResponseDto | null>;
    updateBookingStatus(bookingId: string, status: string): Promise<BookingResponseDto>;
}

