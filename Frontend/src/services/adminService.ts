import apiInstance from '../api/apiInstance';
import { API_ROUTES } from '../constants/routes';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    isBlocked: boolean;
    createdAt: string;
}

const adminService = {
    getAllUsers: async () => {
        const response = await apiInstance.get(API_ROUTES.USERS.GET_ALL);
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
