import { IBookingDocument } from '../interface/booking.interface';
import { BookingResponseDto, BookingListResponseDto } from '../dto/booking.dto';

export const toBookingResponseDto = (booking: IBookingDocument): BookingResponseDto => {
    const isUserPopulated = typeof booking.user === 'object' && booking.user !== null && '_id' in booking.user;
    const userFn = isUserPopulated ? (booking.user as any) : null;

    const isServicePopulated = typeof booking.service === 'object' && booking.service !== null && '_id' in booking.service;
    const serviceFn = isServicePopulated ? (booking.service as any) : null;

    return {
        id: booking._id?.toString() || '',
        userId: isUserPopulated ? (userFn._id?.toString() || '') : (booking.user?.toString() || ''),
        userName: userFn?.name,
        userEmail: userFn?.email,
        serviceId: isServicePopulated ? (serviceFn._id?.toString() || '') : (booking.service?.toString() || ''),
        serviceName: serviceFn?.name,
        serviceImage: serviceFn?.images?.[0],
        user: isUserPopulated ? {
            id: userFn._id?.toString() || '',
            name: userFn.name || '',
            email: userFn.email || '',
        } : undefined,
        service: isServicePopulated ? {
            id: serviceFn._id?.toString() || '',
            name: serviceFn.name || '',
            category: serviceFn.category || '',
            location: serviceFn.location || '',
            images: serviceFn.images || [],
            contactDetails: serviceFn.contactDetails,
        } : undefined,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalPrice: booking.totalPrice,
        status: booking.status,
        bookingDate: booking.bookingDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
    };
};

export const toBookingResponseDtoList = (bookings: IBookingDocument[]): BookingResponseDto[] => {
    return bookings.map(toBookingResponseDto);
};


export const toBookingListResponseDto = (bookings: IBookingDocument[]): BookingListResponseDto => {
    return {
        bookings: toBookingResponseDtoList(bookings),
        total: bookings.length,
    };
};
