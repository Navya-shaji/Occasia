import Service from '../models/service.model';
import { IService, IServiceDocument } from '../interface/service.interface';
import { IServiceRepository } from '../interface/repositories/IServiceRepository';
import { BaseRepository } from './BaseRepository';

export class ServiceRepository extends BaseRepository<IServiceDocument> implements IServiceRepository {
    constructor() {
        super(Service);
    }

    async findAllWithPagination(query: any = {}, sort: any = { createdAt: -1 }, skip: number = 0, limit: number = 10): Promise<{ services: IServiceDocument[], total: number }> {
        const services = await this.model.find(query).sort(sort).skip(skip).limit(limit);
        const total = await this.model.countDocuments(query);
        return { services, total };
    }
}
