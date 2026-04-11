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
    averageRating?: number;
    numReviews?: number;
}

export interface IServiceDocument extends IService, Document {
    averageRating: number;
    numReviews: number;
    createdAt: Date;
    updatedAt: Date;
}
