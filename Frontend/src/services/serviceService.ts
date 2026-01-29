import apiInstance from '../api/apiInstance';
import { API_ROUTES } from '../constants/routes';

export interface Service {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
}

const serviceService = {
    createService: async (serviceData: any) => {
        const response = await apiInstance.post(API_ROUTES.SERVICES.CREATE, serviceData);
        return response.data;
    },

    getAllServices: async (category?: string) => {
        const url = category ? `${API_ROUTES.SERVICES.GET_ALL}?category=${category}` : API_ROUTES.SERVICES.GET_ALL;
        const response = await apiInstance.get(url);
        return response.data;
    },

    getServiceById: async (id: string) => {
        const url = API_ROUTES.SERVICES.GET_BY_ID.replace(':id', id);
        const response = await apiInstance.get(url);
        return response.data;
    },

    updateService: async (id: string, serviceData: any) => {
        const url = API_ROUTES.SERVICES.UPDATE.replace(':id', id);
        const response = await apiInstance.put(url, serviceData);
        return response.data;
    },

    deleteService: async (id: string) => {
        const url = API_ROUTES.SERVICES.DELETE.replace(':id', id);
        const response = await apiInstance.delete(url);
        return response.data;
    }
};

export default serviceService;
