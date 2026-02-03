import { IService, IServiceDocument } from '../service.interface';
import { IBaseRepository } from './IBaseRepository';

export interface IServiceRepository extends IBaseRepository<IServiceDocument> {
    findAllWithPagination(query?: any, sort?: any, skip?: number, limit?: number): Promise<{ services: IServiceDocument[], total: number }>;
}
