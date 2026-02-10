import Booking from '../models/booking.model';
import { IBookingDocument } from '../interface/booking.interface';
import { IBookingRepository } from '../interface/repositories/IBookingRepository';
import { BaseRepository } from './BaseRepository';

export class BookingRepository extends BaseRepository<IBookingDocument> implements IBookingRepository {
    constructor() {
        super(Booking);
    }

    async findById(id: string): Promise<IBookingDocument | null> {
        return await this._model.findById(id).populate('service').populate('user');
    }

    async create(data: Partial<IBookingDocument>): Promise<IBookingDocument> {
        const booking = await this._model.create(data);
        return await booking.populate(['service', 'user']);
    }

    async findAll(query: any = {}): Promise<IBookingDocument[]> {
        return await this._model.find(query).populate('service').populate('user').sort({ createdAt: -1 });
    }

    async findByUserId(userId: string): Promise<IBookingDocument[]> {
        return await this._model.find({ user: userId }).populate('service').sort({ createdAt: -1 });
    }

    async updateStatus(id: string, status: string): Promise<IBookingDocument | null> {
        return await this._model.findByIdAndUpdate(id, { status }, { new: true }).populate('service').populate('user');
    }
}
