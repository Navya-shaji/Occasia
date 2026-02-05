import { IServiceDocument } from '../interface/service.interface';
import { ServiceResponseDto, ServiceListResponseDto } from '../dto/service.dto';

export class ServiceMapper {
    /**
     * Maps a Service entity to ServiceResponseDto
     */
    static toServiceResponseDto(service: IServiceDocument): ServiceResponseDto {
        const dto = new ServiceResponseDto();
        dto.id = service._id.toString();
        dto.name = service.name;
        dto.description = service.description;
        dto.price = service.price;
        dto.pricePerDay = service.pricePerDay;
        dto.category = service.category;
        dto.location = service.location;
        dto.images = service.images;
        dto.isAvailable = service.isAvailable;
        dto.unavailableDates = service.unavailableDates;
        dto.contactDetails = service.contactDetails;
        dto.createdAt = service.createdAt;
        dto.updatedAt = service.updatedAt;
        return dto;
    }

    /**
     * Maps multiple Service entities to ServiceResponseDto array
     */
    static toServiceResponseDtoList(services: IServiceDocument[]): ServiceResponseDto[] {
        return services.map(service => this.toServiceResponseDto(service));
    }

    /**
     * Maps services with pagination info to ServiceListResponseDto
     */
    static toServiceListResponseDto(
        services: IServiceDocument[],
        total: number,
        page: number = 1,
        limit: number = 10
    ): ServiceListResponseDto {
        const dto = new ServiceListResponseDto();
        dto.services = this.toServiceResponseDtoList(services);
        dto.total = total;
        dto.page = page;
        dto.limit = limit;
        dto.totalPages = Math.ceil(total / limit);
        return dto;
    }
}
