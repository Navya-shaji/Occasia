import { ServiceRepository } from '../repositories/ServiceRepository';
import { IService, IServiceDocument } from '../interface/service.interface';
import { ServiceResponseDto, ServiceListResponseDto, ServiceFilterDto } from '../dto/service.dto';
import { toServiceResponseDto, toServiceListResponseDto } from '../mappers/service.mapper';

export class ServiceService {
    constructor(private _serviceRepository: ServiceRepository) { }

    async createService(serviceData: IService): Promise<ServiceResponseDto> {
        const service = await this._serviceRepository.create(serviceData);
        return toServiceResponseDto(service);
    }

    async getAllServices(filters: ServiceFilterDto): Promise<ServiceListResponseDto> {
        const { category, location, keyword, minPrice, maxPrice, sort = '-createdAt', page = 1, limit = 10, date } = filters;

        const query: any = {};
        if (category) query.category = category;
        if (location) query.location = new RegExp(location, 'i');
        if (keyword) {
            query.$or = [
                { name: new RegExp(keyword, 'i') },
                { description: new RegExp(keyword, 'i') }
            ];
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.pricePerDay = {};
            if (minPrice !== undefined) query.pricePerDay.$gte = minPrice;
            if (maxPrice !== undefined) query.pricePerDay.$lte = maxPrice;
        }

        if (date) {
            query.unavailableDates = { $ne: date };
        }

        const skip = (page - 1) * limit;

        // Handle sorting
        let sortObj: any = {};
        if (sort === 'priceLow') sortObj = { pricePerDay: 1 };
        else if (sort === 'priceHigh') sortObj = { pricePerDay: -1 };
        else if (sort === 'newest') sortObj = { createdAt: -1 };
        else sortObj = { createdAt: -1 };

        const result = await this._serviceRepository.findAllWithPagination(query, sortObj, skip, limit);

        return toServiceListResponseDto(result.services, result.total, page, limit);
    }

    async getServiceById(id: string): Promise<ServiceResponseDto | null> {
        const service = await this._serviceRepository.findById(id);
        return service ? toServiceResponseDto(service) : null;
    }

    async updateService(id: string, serviceData: Partial<IService>): Promise<ServiceResponseDto | null> {
        const service = await this._serviceRepository.update(id, serviceData);
        return service ? toServiceResponseDto(service) : null;
    }

    async deleteService(id: string): Promise<boolean> {
        return await this._serviceRepository.delete(id);
    }
}

