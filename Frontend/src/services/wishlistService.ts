import apiInstance from '../api/apiInstance';
import { API_ROUTES } from '../constants/routes';

const wishlistService = {
    getWishlist: async () => {
        const response = await apiInstance.get(API_ROUTES.WISHLIST.GET_ALL);
        return response.data;
    },

    addToWishlist: async (serviceId: string) => {
        const response = await apiInstance.post(API_ROUTES.WISHLIST.ADD, { serviceId });
        return response.data;
    },

    removeFromWishlist: async (serviceId: string) => {
        const url = API_ROUTES.WISHLIST.REMOVE.replace(':serviceId', serviceId);
        const response = await apiInstance.delete(url);
        return response.data;
    }
};

export default wishlistService;
