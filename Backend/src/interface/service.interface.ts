import { Document } from 'mongoose';

export interface IService {
    name: string;
    description: string;
    price: number;
    category: string;
    location: string;
    images: string[];
    isAvailable: boolean;
    unavailableDates: string[];
}

export interface IServiceDocument extends IService, Document {
    createdAt: Date;
    updatedAt: Date;
}
