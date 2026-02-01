import { Document } from 'mongoose';

export interface IService {
    name: string;
    description: string;
    price: number;
    pricePerDay: number;
    category: string;
    location: string;
    images: string[];
    isAvailable: boolean;
    unavailableDates: string[];
    contactDetails: {
        phone: string;
        email: string;
        address?: string;
    };
}

export interface IServiceDocument extends IService, Document {
    createdAt: Date;
    updatedAt: Date;
}
