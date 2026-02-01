import { Request, Response } from 'express';
import { IBookingService } from '../interface/services/IBookingService';
import { HTTP_STATUS } from '../constants/httpStatus';

export class BookingController {
    constructor(private bookingService: IBookingService) { }

    createBooking = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const { serviceId, startDate, endDate } = req.body;

            const booking = await this.bookingService.createBooking(userId, serviceId, startDate, endDate);

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Booking created successfully',
                data: booking
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: error.message || 'Error creating booking'
            });
        }
    };

    getUserBookings = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const bookings = await this.bookingService.getUserBookings(userId);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Bookings fetched successfully',
                data: bookings
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error fetching bookings'
            });
        }
    };

    getBookingById = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const bookingId = req.params.id as string;
            const booking = await this.bookingService.getBookingById(bookingId, userId);

            if (!booking) {
                res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Booking not found' });
                return;
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: booking
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: error.message
            });
        }
    };

    getAllBookings = async (req: Request, res: Response) => {
        try {
            const bookings = await this.bookingService.getAllBookings();

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'All bookings fetched successfully',
                data: bookings
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error fetching all bookings'
            });
        }
    };

    cancelBooking = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const bookingId = req.params.id as string;

            const booking = await this.bookingService.cancelBooking(bookingId, userId);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Booking cancelled successfully',
                data: booking
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: error.message || 'Error cancelling booking'
            });
        }
    };

    updateStatus = async (req: Request, res: Response) => {
        try {
            const bookingId = req.params.id as string;
            const { status } = req.body;

            const booking = await this.bookingService.updateBookingStatus(bookingId, status);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Booking status updated successfully',
                data: booking
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: error.message || 'Error updating status'
            });
        }
    };
}
