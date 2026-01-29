import { Request, Response } from 'express';
import { ServiceService } from '../services/ServiceService';
import { HTTP_STATUS } from '../constants/httpStatus';

export class ServiceController {
    constructor(private serviceService: ServiceService) { }

    createService = async (req: Request, res: Response) => {
        try {
            const service = await this.serviceService.createService(req.body);
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Service created successfully',
                data: service
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error creating service'
            });
        }
    };

    getAllServices = async (req: Request, res: Response) => {
        try {
            const {
                category,
                location,
                keyword,
                minPrice,
                maxPrice,
                sort,
                page,
                limit,
                date
            } = req.query;

            const result = await this.serviceService.getAllServices({
                category: category as string,
                location: location as string,
                keyword: keyword as string,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                sort: sort as string,
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
                date: date as string
            });

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Services fetched successfully',
                data: result.services,
                total: result.total,
                page: Number(page) || 1,
                limit: Number(limit) || 10
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error fetching services'
            });
        }
    };

    getServiceById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const service = await this.serviceService.getServiceById(id);
            if (!service) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: 'Service not found'
                });
            }
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Service fetched successfully',
                data: service
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error fetching service'
            });
        }
    };

    updateService = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const service = await this.serviceService.updateService(id, req.body);
            if (!service) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: 'Service not found'
                });
            }
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Service updated successfully',
                data: service
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error updating service'
            });
        }
    };

    deleteService = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const service = await this.serviceService.deleteService(id);
            if (!service) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: 'Service not found'
                });
            }
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Service deleted successfully',
                data: service
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error deleting service'
            });
        }
    };
}
