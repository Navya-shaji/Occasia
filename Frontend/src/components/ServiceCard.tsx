import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Image as ImageIcon, Heart } from 'lucide-react';
import { APP_ROUTES } from '../constants/routes';
import { Service } from '../services/serviceService';
import { useSelector } from 'react-redux';
import wishlistService from '../services/wishlistService';
import toast from 'react-hot-toast';

interface ServiceCardProps {
    service: Service;
    isFavorite?: boolean;
    onToggleFavorite?: (id: string) => void;
}

export default function ServiceCard({ service, isFavorite, onToggleFavorite }: ServiceCardProps) {
    const { isAuthenticated } = useSelector((state: any) => state.auth);

    const handleHeartClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error('Please login to add to wishlist');
            return;
        }

        try {
            if (isFavorite) {
                await wishlistService.removeFromWishlist(service.id || (service as any)._id);
                toast.success('Removed from wishlist');
            } else {
                await wishlistService.addToWishlist(service.id || (service as any)._id);
                toast.success('Added to wishlist');
            }
            if (onToggleFavorite) {
                onToggleFavorite(service.id || (service as any)._id);
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const serviceId = service.id || (service as any)._id || '';

    return (
        <Link
            to={APP_ROUTES.SERVICE_DETAILS.replace(':id', serviceId)}
            className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 relative flex flex-col h-full"
        >
            <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                {service.images?.[0] ? (
                    <img
                        src={service.images[0].startsWith('http') ? service.images[0] : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1212'}${service.images[0]}`}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon size={40} />
                    </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                    {service.category}
                </div>

                <button
                    onClick={handleHeartClick}
                    className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-md ${
                        isFavorite 
                        ? 'bg-red-500 text-white fill-current' 
                        : 'bg-white/80 text-gray-600 hover:text-red-500 hover:bg-white'
                    }`}
                >
                    <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                        {service.name}
                    </h3>
                    <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-black">
                        <Star size={14} fill="currentColor" className="mr-1 text-yellow-500" />
                        {service.averageRating || '4.8'}
                    </div>
                </div>

                <div className="flex items-center text-gray-500 text-sm mb-6">
                    <MapPin size={16} className="mr-1.5 text-blue-500" />
                    {service.location || 'Location varies'}
                </div>

                <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-4">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Starting from</p>
                        <span className="text-2xl font-black text-blue-700">₹{service.pricePerDay || service.price}</span>
                        <span className="text-sm font-bold text-gray-500 ml-1">/ day</span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <span>Details</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}
