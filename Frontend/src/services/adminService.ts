import apiInstance from '../api/apiInstance';
import { API_ROUTES } from '../constants/routes';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    isBlocked: boolean;
    createdAt?: string;
}

const adminService = {
    getAllUsers: async (page: number = 1, limit: number = 10, search: string = '', status: string = 'all') => {
        const response = await apiInstance.get(`${API_ROUTES.USERS.GET_ALL}?page=${page}&limit=${limit}&search=${search}&status=${status}`);
        return response.data;
    },

    blockUser: async (userId: string) => {
        const url = API_ROUTES.USERS.BLOCK.replace(':id', userId);
        const response = await apiInstance.patch(url);
        return response.data;
    },

    unblockUser: async (userId: string) => {
        const url = API_ROUTES.USERS.UNBLOCK.replace(':id', userId);
        const response = await apiInstance.patch(url);
        return response.data;
    }
};

export default adminService;
