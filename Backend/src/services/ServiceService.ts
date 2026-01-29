import { ServiceRepository } from '../repositories/ServiceRepository';
import { IService, IServiceDocument } from '../interface/service.interface';

export class ServiceService {
    constructor(private serviceRepository: ServiceRepository) { }

    async createService(serviceData: IService): Promise<IServiceDocument> {
        return await this.serviceRepository.create(serviceData);
    }

    async getAllServices(category?: string): Promise<IServiceDocument[]> {
        const query = category ? { category } : {};
        return await this.serviceRepository.findAll(query);
    }

    async getServiceById(id: string): Promise<IServiceDocument | null> {
        return await this.serviceRepository.findById(id);
    }

    async updateService(id: string, serviceData: Partial<IService>): Promise<IServiceDocument | null> {
        return await this.serviceRepository.update(id, serviceData);
    }

    async deleteService(id: string): Promise<IServiceDocument | null> {
        return await this.serviceRepository.delete(id);
    }
}
