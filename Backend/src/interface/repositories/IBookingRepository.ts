import { IBooking, IBookingDocument } from '../booking.interface';
import { IBaseRepository } from './IBaseRepository';

export interface IBookingRepository extends IBaseRepository<IBookingDocument> {
    findByUserId(userId: string): Promise<IBookingDocument[]>;
    updateStatus(id: string, status: string): Promise<IBookingDocument | null>;
}
