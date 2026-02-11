import { IBookingDocument } from '../interface/booking.interface';
import { BookingResponseDto, BookingListResponseDto } from '../dto/booking.dto';

export const toBookingResponseDto = (booking: IBookingDocument): BookingResponseDto => {
    // Check if fields are populated
    const userObj = booking.user as any;
    const isUserPopulated = !!(userObj && typeof userObj === 'object' && userObj.email);
    const userFn = isUserPopulated ? userObj : null;

    const serviceObj = booking.service as any;
    const isServicePopulated = !!(serviceObj && typeof serviceObj === 'object' && (serviceObj.name || (booking.populated && booking.populated('service'))));
    const serviceFn = isServicePopulated ? serviceObj : null;

    // Get the raw ID if population returned null (e.g. service was deleted)
    const rawUserId = booking.populated ? booking.populated('user') : null;
    const rawServiceId = booking.populated ? booking.populated('service') : null;

    const userId = isUserPopulated ? (userFn._id?.toString() || userFn.id) : (rawUserId?.toString() || booking.user?.toString());
    const serviceId = isServicePopulated ? (serviceFn._id?.toString() || serviceFn.id) : (rawServiceId?.toString() || booking.service?.toString());

    return {
        id: booking._id?.toString() || '',
        userId: userId || '',
        userName: userFn?.name,
        userEmail: userFn?.email,
        serviceId: serviceId || '',
        serviceName: booking.serviceName || serviceFn?.name,
        serviceImage: booking.serviceImage || serviceFn?.images?.[0],
        user: isUserPopulated ? {
            id: userFn._id?.toString() || userFn.id || '',
            name: userFn.name || '',
            email: userFn.email || '',
        } : undefined,
        service: isServicePopulated ? {
            id: serviceFn._id?.toString() || serviceFn.id || '',
            name: serviceFn.name || '',
            category: serviceFn.category || '',
            location: serviceFn.location || '',
            images: serviceFn.images || [],
            contactDetails: serviceFn.contactDetails || { phone: 'N/A', email: 'N/A' },
        } : {
            id: serviceId || '',
            name: booking.serviceName || '',
            category: 'N/A',
            location: booking.location || '',
            images: booking.serviceImage ? [booking.serviceImage] : [],
            contactDetails: { phone: 'N/A', email: 'N/A' },
        },
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
