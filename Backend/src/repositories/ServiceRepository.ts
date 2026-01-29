import Service from '../models/service.model';
import { IService, IServiceDocument } from '../interface/service.interface';

export class ServiceRepository {
    async create(serviceData: IService): Promise<IServiceDocument> {
        return await Service.create(serviceData);
    }

    async findById(id: string): Promise<IServiceDocument | null> {
        return await Service.findById(id);
    }

    async findAll(query: any = {}, sort: any = { createdAt: -1 }, skip: number = 0, limit: number = 10): Promise<{ services: IServiceDocument[], total: number }> {
        const services = await Service.find(query).sort(sort).skip(skip).limit(limit);
        const total = await Service.countDocuments(query);
        return { services, total };
    }

    async update(id: string, serviceData: Partial<IService>): Promise<IServiceDocument | null> {
        return await Service.findByIdAndUpdate(id, serviceData, { new: true });
    }

    async delete(id: string): Promise<IServiceDocument | null> {
        return await Service.findByIdAndDelete(id);
    }
}
