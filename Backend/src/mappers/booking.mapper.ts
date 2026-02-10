import { IBookingDocument } from '../interface/booking.interface';
import { BookingResponseDto, BookingListResponseDto } from '../dto/booking.dto';

export const toBookingResponseDto = (booking: IBookingDocument): BookingResponseDto => {
    // Robust check for populated user (Mongoose can return ObjectId as an object with _bsontype)
    const userObj = booking.user as any;
    const isUserPopulated = userObj && typeof userObj === 'object' && !userObj._bsontype && (userObj.name || userObj.email);
    const userFn = isUserPopulated ? userObj : null;

    // Robust check for populated service
    const serviceObj = booking.service as any;
    const isServicePopulated = serviceObj && typeof serviceObj === 'object' && !serviceObj._bsontype && (serviceObj.name || serviceObj.category);
    const serviceFn = isServicePopulated ? serviceObj : null;

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
