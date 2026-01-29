import { Document } from 'mongoose';

export interface IService {
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    isAvailable: boolean;
}

export interface IServiceDocument extends IService, Document {
    createdAt: Date;
    updatedAt: Date;
}
