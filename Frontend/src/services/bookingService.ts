import apiInstance from '../api/apiInstance';
import { API_ROUTES } from '../constants/routes';

export interface Booking {
    id: string;
    user: any;
    service: any;
    userName?: string;
    userEmail?: string;
    serviceName?: string;
    serviceImage?: string;
    serviceId?: string;
    location?: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    bookingDate: string;
    createdAt: string;
}

const bookingService = {
    createBooking: async (bookingData: { serviceId: string; startDate: string; endDate: string }) => {
        const response = await apiInstance.post(API_ROUTES.BOOKINGS.CREATE, bookingData);
        return response.data;
    },

    getMyBookings: async () => {
        const response = await apiInstance.get(API_ROUTES.BOOKINGS.GET_MY);
        return response.data;
    },

    getBookingById: async (id: string) => {
        const url = API_ROUTES.BOOKINGS.GET_BY_ID.replace(':id', id);
        const response = await apiInstance.get(url);
        return response.data;
    },

    getAllBookings: async () => {
        const response = await apiInstance.get(API_ROUTES.BOOKINGS.GET_ALL);
        return response.data;
    },

    cancelBooking: async (id: string) => {
        const url = API_ROUTES.BOOKINGS.CANCEL.replace(':id', id);
        const response = await apiInstance.post(url);
        return response.data;
    },

    updateStatus: async (id: string, status: string) => {
        const url = API_ROUTES.BOOKINGS.UPDATE_STATUS.replace(':id', id);
        const response = await apiInstance.patch(url, { status });
        return response.data;
    }
};

export default bookingService;
