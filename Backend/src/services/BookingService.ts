import { IBookingRepository } from '../interface/repositories/IBookingRepository';
import { IBookingService } from '../interface/services/IBookingService';
import { IBookingDocument } from '../interface/booking.interface';
import { ServiceRepository } from '../repositories/ServiceRepository';
import { UserRepository } from '../repositories/UserRepository';

import { Schema } from 'mongoose';
import { CreateBookingDto, BookingResponseDto } from '../dto/booking.dto';
import { toBookingResponseDto, toBookingResponseDtoList } from '../mappers/booking.mapper';

export class BookingService implements IBookingService {
    constructor(
        private _bookingRepository: IBookingRepository,
        private _serviceRepository: ServiceRepository,
        private _userRepository: UserRepository
    ) { }

    async createBooking(userId: string, serviceId: string, startDate: string, endDate: string): Promise<BookingResponseDto> {
        const [service, user] = await Promise.all([
            this._serviceRepository.findById(serviceId),
            this._userRepository.findById(userId)
        ]);

        if (!service) throw new Error('Service not found');
        if (!user) throw new Error('User not found');

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            throw new Error('End date must be after start date');
        }

        // Calculate total days
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive

        const totalPrice = diffDays * service.pricePerDay;

        // Check availability
        const requestedDates: string[] = [];
        let currentDate = new Date(start);
        while (currentDate <= end) {
            requestedDates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const isUnavailable = requestedDates.some(date => service.unavailableDates.includes(date));
        if (isUnavailable) {
            throw new Error('Service is not available for requested dates');
        }

        const booking = await this._bookingRepository.create({
            user: userId as unknown as Schema.Types.ObjectId,
            service: serviceId as unknown as Schema.Types.ObjectId,
            startDate: start,
            endDate: end,
            totalPrice,
            status: 'PENDING',
            serviceName: service.name,
            serviceImage: service.images?.[0] || '',
            location: service.location
        });

        // Update service's unavailable dates
        await this._serviceRepository.update(serviceId, {
            unavailableDates: [...service.unavailableDates, ...requestedDates]
        });



        return toBookingResponseDto(booking);
    }

    async getUserBookings(userId: string): Promise<BookingResponseDto[]> {
        const bookings = await this._bookingRepository.findByUserId(userId);
        return toBookingResponseDtoList(bookings);
    }

    async getAllBookings(): Promise<BookingResponseDto[]> {
        const bookings = await this._bookingRepository.findAll();
        return toBookingResponseDtoList(bookings);
    }

    async getBookingById(bookingId: string, userId: string): Promise<BookingResponseDto | null> {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking) return null;

    
        if ((booking.user as any)._id.toString() !== userId) {
            throw new Error("Unauthorized access to booking");
        }
        return toBookingResponseDto(booking);
    }

    async cancelBooking(bookingId: string, userId: string): Promise<BookingResponseDto> {
        const booking = await this._bookingRepository.findById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }

        if (booking.user.toString() !== userId && (booking.user as any)._id?.toString() !== userId) {
            throw new Error('Unauthorized');
        }

        if (booking.status === 'CANCELLED') {
            throw new Error('Booking is already cancelled');
        }

        const updated = await this._bookingRepository.updateStatus(bookingId, 'CANCELLED');
        return toBookingResponseDto(updated!);
    }

    async updateBookingStatus(bookingId: string, status: string): Promise<BookingResponseDto> {
        const updated = await this._bookingRepository.updateStatus(bookingId, status);
        if (!updated) {
            throw new Error('Booking not found');
        }
        return toBookingResponseDto(updated);
    }
}

