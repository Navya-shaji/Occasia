import apiInstance from '../api/apiInstance';
import { API_ROUTES } from '../constants/routes';

const reviewService = {
    createReview: async (reviewData: { booking: string, service: string, rating: number, comment: string }) => {
        const response = await apiInstance.post(API_ROUTES.REVIEWS.CREATE, reviewData);
        return response.data;
    },

    getReviewsByService: async (serviceId: string) => {
        const url = API_ROUTES.REVIEWS.GET_BY_SERVICE.replace(':serviceId', serviceId);
        const response = await apiInstance.get(url);
        return response.data;
    },

    getMyReviews: async () => {
        const response = await apiInstance.get(API_ROUTES.REVIEWS.GET_MY);
        return response.data;
    }
};

export default reviewService;
