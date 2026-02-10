// Request DTOs
export class CreateBookingDto {
    serviceId!: string;
    startDate!: string;
    endDate!: string;
}

export class UpdateBookingStatusDto {
    status!: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

// Response DTOs
export class BookingResponseDto {
    id!: string;
    userId!: string;
    serviceId!: string;
    serviceName?: string;
    serviceImage?: string;
    userName?: string;
    userEmail?: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    service?: {
        id: string;
        name: string;
        category: string;
        location: string;
        images: string[];
        contactDetails?: {
            phone: string;
            email: string;
        };
    };
    startDate!: Date;
    endDate!: Date;
    totalPrice!: number;
    status!: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    bookingDate!: Date;
    createdAt!: Date;
    updatedAt!: Date;
}

export class BookingListResponseDto {
    bookings!: BookingResponseDto[];
    total!: number;
}
