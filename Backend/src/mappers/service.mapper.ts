import { IServiceDocument } from '../interface/service.interface';
import { ServiceResponseDto, ServiceListResponseDto } from '../dto/service.dto';

export const toServiceResponseDto = (service: IServiceDocument): ServiceResponseDto => ({
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

export const toServiceResponseDtoList = (services: IServiceDocument[]): ServiceResponseDto[] => {
    return services.map(toServiceResponseDto);
};

export const toServiceListResponseDto = (
    services: IServiceDocument[],
    total: number,
    page: number = 1,
    limit: number = 10
): ServiceListResponseDto => ({
    services: toServiceResponseDtoList(services),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
});
