import Service from '../models/service.model';
import { IService, IServiceDocument } from '../interface/service.interface';

export class ServiceRepository {
    async create(serviceData: IService): Promise<IServiceDocument> {
        return await Service.create(serviceData);
    }

    async findById(id: string): Promise<IServiceDocument | null> {
        return await Service.findById(id);
    }

    async findAll(query: any = {}): Promise<IServiceDocument[]> {
        return await Service.find(query).sort({ createdAt: -1 });
    }

    async update(id: string, serviceData: Partial<IService>): Promise<IServiceDocument | null> {
        return await Service.findByIdAndUpdate(id, serviceData, { new: true });
    }

    async delete(id: string): Promise<IServiceDocument | null> {
        return await Service.findByIdAndDelete(id);
    }
}
