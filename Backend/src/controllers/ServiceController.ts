import { Request, Response } from 'express';
import { ServiceService } from '../services/ServiceService';
import { HTTP_STATUS } from '../constants/httpStatus';

export class ServiceController {
    constructor(private _serviceService: ServiceService) { }

    createService = async (req: Request, res: Response) => {
        try {
            const serviceData = req.body;

            // Handle uploaded images
            if (req.files && Array.isArray(req.files)) {
                console.log('Uploaded files:', req.files);
                serviceData.images = req.files.map((file: any) => file.path);
                console.log('Mapped image paths:', serviceData.images);
            }

            const service = await this._serviceService.createService(serviceData);
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

            const result = await this._serviceService.getAllServices({
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
            const service = await this._serviceService.getServiceById(id);
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
            const serviceData = req.body;

            // Handle uploaded images
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                serviceData.images = req.files.map((file: any) => file.path);
            }

            const service = await this._serviceService.updateService(id, serviceData);
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
            const service = await this._serviceService.deleteService(id);
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
