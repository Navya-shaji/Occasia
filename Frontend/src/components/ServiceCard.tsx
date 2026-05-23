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
            className="group overflow-hidden flex flex-col h-full transition-all duration-300"
            style={{
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px',
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(232, 213, 176, 0.2)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
            }}
        >
            {/* Image */}
            <div className="aspect-[4/3] relative overflow-hidden" style={{ background: '#222' }}>
                {service.images?.[0] ? (
                    <img
                        src={service.images[0].startsWith('http') ? service.images[0] : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1212'}${service.images[0]}`}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ color: '#444' }}>
                        <ImageIcon size={40} />
                    </div>
                )}

                {/* Category badge */}
                <div
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                        background: 'rgba(17,17,17,0.8)',
                        backdropFilter: 'blur(8px)',
                        color: '#e8d5b0',
                        border: '1px solid rgba(232, 213, 176, 0.2)',
                    }}
                >
                    {service.category}
                </div>

                {/* Wishlist button */}
                <button
                    onClick={handleHeartClick}
                    className="absolute top-3 right-3 p-2 rounded-full transition-all duration-300"
                    style={{
                        background: isFavorite ? '#e8d5b0' : 'rgba(17,17,17,0.8)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: isFavorite ? '#111' : '#888',
                    }}
                >
                    <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3
                        className="text-base font-bold line-clamp-1 flex-1 mr-2 transition-colors"
                        style={{ color: '#f5ede0' }}
                    >
                        {service.name}
                    </h3>
                    <div
                        className="flex items-center px-2 py-1 rounded-lg text-xs font-bold flex-shrink-0"
                        style={{ background: 'rgba(232, 213, 176, 0.1)', color: '#e8d5b0' }}
                    >
                        <Star size={12} fill="currentColor" className="mr-1" />
                        {service.averageRating || '4.8'}
                    </div>
                </div>

                <div className="flex items-center text-sm mb-4" style={{ color: '#666' }}>
                    <MapPin size={14} className="mr-1.5 flex-shrink-0" style={{ color: '#888' }} />
                    <span className="truncate">{service.location || 'Location varies'}</span>
                </div>

                <div
                    className="mt-auto flex items-end justify-between pt-4"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                    <div>
                        <p className="text-xs mb-0.5" style={{ color: '#555' }}>Starting from</p>
                        <span className="text-xl font-black" style={{ color: '#e8d5b0' }}>
                            ₹{service.pricePerDay || service.price}
                        </span>
                        <span className="text-xs ml-1" style={{ color: '#666' }}>/ day</span>
                    </div>
                    <div
                        className="flex items-center space-x-1 text-xs font-semibold px-3 py-2 rounded-full transition-all duration-300"
                        style={{
                            background: 'rgba(232, 213, 176, 0.08)',
                            color: '#e8d5b0',
                            border: '1px solid rgba(232, 213, 176, 0.15)',
                        }}
                    >
                        <span>Details</span>
                        <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}
