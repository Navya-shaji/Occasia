import { IServiceDocument } from '../interface/service.interface';
import { ServiceResponseDto, ServiceListResponseDto } from '../dto/service.dto';

/**
 * Maps a Service entity to ServiceResponseDto
 */
export const toServiceResponseDto = (service: IServiceDocument): ServiceResponseDto => {
    return Object.assign(new ServiceResponseDto(), {
        id: service._id.toString(),
        name: service.name,
        description: service.description,
        price: service.price,
        pricePerDay: service.pricePerDay,
        category: service.category,
        location: service.location,
        images: service.images,
        isAvailable: service.isAvailable,
        unavailableDates: service.unavailableDates,
        contactDetails: service.contactDetails,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
    });
};

/**
 * Maps multiple Service entities to ServiceResponseDto array
 */
export const toServiceResponseDtoList = (services: IServiceDocument[]): ServiceResponseDto[] => {
    return services.map(service => toServiceResponseDto(service));
};

/**
 * Maps services with pagination info to ServiceListResponseDto
 */
export const toServiceListResponseDto = (
    services: IServiceDocument[],
    total: number,
    page: number = 1,
    limit: number = 10
): ServiceListResponseDto => {
    return Object.assign(new ServiceListResponseDto(), {
        services: toServiceResponseDtoList(services),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    });
};
