import { IBookingDocument } from '../interface/booking.interface';
import { BookingResponseDto, BookingListResponseDto } from '../dto/booking.dto';

export class BookingMapper {
    /**
     * Maps a Booking entity to BookingResponseDto
     * Handles populated and non-populated references
     */
    static toBookingResponseDto(booking: IBookingDocument): BookingResponseDto {
        const dto = new BookingResponseDto();
        dto.id = booking._id.toString();

        // Handle user reference (can be populated or just ObjectId)
        if (typeof booking.user === 'object' && booking.user !== null && '_id' in booking.user) {
            dto.userId = (booking.user as any)._id.toString();
            dto.userName = (booking.user as any).name;
            dto.userEmail = (booking.user as any).email;
        } else {
            dto.userId = booking.user.toString();
        }

        // Handle service reference (can be populated or just ObjectId)
        if (typeof booking.service === 'object' && booking.service !== null && '_id' in booking.service) {
            dto.serviceId = (booking.service as any)._id.toString();
            dto.serviceName = (booking.service as any).name;
            dto.serviceImage = (booking.service as any).images?.[0];
        } else {
            dto.serviceId = booking.service.toString();
        }

        dto.startDate = booking.startDate;
        dto.endDate = booking.endDate;
        dto.totalPrice = booking.totalPrice;
        dto.status = booking.status;
        dto.bookingDate = booking.bookingDate;
        dto.createdAt = booking.createdAt;
        dto.updatedAt = booking.updatedAt;

        return dto;
    }

    /**
     * Maps multiple Booking entities to BookingResponseDto array
     */
    static toBookingResponseDtoList(bookings: IBookingDocument[]): BookingResponseDto[] {
        return bookings.map(booking => this.toBookingResponseDto(booking));
    }

    /**
     * Maps bookings to BookingListResponseDto
     */
    static toBookingListResponseDto(bookings: IBookingDocument[]): BookingListResponseDto {
        const dto = new BookingListResponseDto();
        dto.bookings = this.toBookingResponseDtoList(bookings);
        dto.total = bookings.length;
        return dto;
    }
}
