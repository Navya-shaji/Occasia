// Request DTOs
export class CreateServiceDto {
    name!: string;
    description!: string;
    price!: number;
    pricePerDay!: number;
    category!: string;
    location!: string;
    images!: string[];
    isAvailable?: boolean;
    unavailableDates?: string[];
    contactDetails!: {
        phone: string;
        email: string;
        address?: string;
    };
}

export class UpdateServiceDto {
    name?: string;
    description?: string;
    price?: number;
    pricePerDay?: number;
    category?: string;
    location?: string;
    images?: string[];
    isAvailable?: boolean;
    unavailableDates?: string[];
    contactDetails?: {
        phone: string;
        email: string;
        address?: string;
    };
}

export class ServiceFilterDto {
    category?: string;
    location?: string;
    keyword?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
    date?: string;
}

// Response DTOs
export class ServiceResponseDto {
    id!: string;
    name!: string;
    description!: string;
    price!: number;
    pricePerDay!: number;
    category!: string;
    location!: string;
    images!: string[];
    isAvailable!: boolean;
    unavailableDates!: string[];
    contactDetails!: {
        phone: string;
        email: string;
        address?: string;
    };
    createdAt!: Date;
    updatedAt!: Date;
}

export class ServiceListResponseDto {
    services!: ServiceResponseDto[];
    total!: number;
    page!: number;
    limit!: number;
    totalPages!: number;
}
