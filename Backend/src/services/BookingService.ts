import { IBookingRepository } from '../interface/repositories/IBookingRepository';
import { IBookingService } from '../interface/services/IBookingService';
import { IBookingDocument } from '../interface/booking.interface';
import { ServiceRepository } from '../repositories/ServiceRepository';
import { UserRepository } from '../repositories/UserRepository';
import { sendBookingConfirmation } from './mail.service';
import { Schema } from 'mongoose';

export class BookingService implements IBookingService {
    constructor(
        private bookingRepository: IBookingRepository,
        private serviceRepository: ServiceRepository,
        private userRepository: UserRepository
    ) { }

    async createBooking(userId: string, serviceId: string, startDate: string, endDate: string): Promise<IBookingDocument> {
        const [service, user] = await Promise.all([
            this.serviceRepository.findById(serviceId),
            this.userRepository.findById(userId)
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

        const booking = await this.bookingRepository.create({
            user: userId as unknown as Schema.Types.ObjectId,
            service: serviceId as unknown as Schema.Types.ObjectId,
            startDate: start,
            endDate: end,
            totalPrice,
            status: 'PENDING'
        });

        // Update service's unavailable dates
        await this.serviceRepository.update(serviceId, {
            unavailableDates: [...service.unavailableDates, ...requestedDates]
        });

        // Send Email Notification
        sendBookingConfirmation(user.email, {
            serviceName: service.name,
            startDate: start.toLocaleDateString(),
            endDate: end.toLocaleDateString(),
            totalPrice,
            status: 'PENDING'
        });

        return booking;
    }

    async getUserBookings(userId: string): Promise<IBookingDocument[]> {
        return await this.bookingRepository.findByUserId(userId);
    }

    async getAllBookings(): Promise<IBookingDocument[]> {
        return await this.bookingRepository.findAll();
    }

    async getBookingById(bookingId: string, userId: string): Promise<IBookingDocument | null> {
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking) return null;

        // Ensure user owns the booking (unless admin, but logic here assumes simpler checks)
        // For simplicity allow if match, controller can handle logic
        if ((booking.user as any)._id.toString() !== userId) {
            throw new Error("Unauthorized access to booking");
        }
        return booking;
    }

    async cancelBooking(bookingId: string, userId: string): Promise<IBookingDocument> {
        const booking = await this.bookingRepository.findById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }

        if (booking.user.toString() !== userId) {
            throw new Error('Unauthorized');
        }

        if (booking.status === 'CANCELLED') {
            throw new Error('Booking is already cancelled');
        }

        // Normally we'd also free up the dates here, but simple cancel for now
        const updated = await this.bookingRepository.updateStatus(bookingId, 'CANCELLED');
        return updated!;
    }

    async updateBookingStatus(bookingId: string, status: string): Promise<IBookingDocument> {
        const updated = await this.bookingRepository.updateStatus(bookingId, status);
        if (!updated) {
            throw new Error('Booking not found');
        }
        return updated;
    }
}
