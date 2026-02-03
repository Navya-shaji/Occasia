import { ServiceRepository } from '../repositories/ServiceRepository';
import { IService, IServiceDocument } from '../interface/service.interface';

export class ServiceService {
    constructor(private serviceRepository: ServiceRepository) { }

    async createService(serviceData: IService): Promise<IServiceDocument> {
        return await this.serviceRepository.create(serviceData);
    }

    async getAllServices(filters: {
        category?: string,
        location?: string,
        keyword?: string,
        minPrice?: number,
        maxPrice?: number,
        sort?: string,
        page?: number,
        limit?: number,
        date?: string
    }): Promise<{ services: IServiceDocument[], total: number }> {
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

        return await this.serviceRepository.findAllWithPagination(query, sortObj, skip, limit);
    }

    async getServiceById(id: string): Promise<IServiceDocument | null> {
        return await this.serviceRepository.findById(id);
    }

    async updateService(id: string, serviceData: Partial<IService>): Promise<IServiceDocument | null> {
        return await this.serviceRepository.update(id, serviceData);
    }

    async deleteService(id: string): Promise<boolean> {
        return await this.serviceRepository.delete(id);
    }
}
