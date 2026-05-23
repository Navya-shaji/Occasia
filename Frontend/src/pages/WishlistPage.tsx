import React, { useState, useEffect } from 'react';
import wishlistService from '../services/wishlistService';
import ServiceCard from '../components/ServiceCard';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../constants/routes';
import toast from 'react-hot-toast';

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const response = await wishlistService.getWishlist();
            setWishlist(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            toast.error('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = (id: string) => {
        setWishlist(prev => prev.filter(item => (item.id || item._id) !== id));
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8" style={{ background: '#111111' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-4 mb-10">
                    <div
                        className="p-3 rounded-2xl"
                        style={{ background: 'rgba(232, 213, 176, 0.1)', border: '1px solid rgba(232, 213, 176, 0.2)' }}
                    >
                        <Heart size={28} fill="currentColor" style={{ color: '#e8d5b0' }} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight" style={{ color: '#f5ede0' }}>My Wishlist</h1>
                        <p className="text-sm mt-0.5" style={{ color: '#666' }}>Your curated collection of premium experiences</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                className="rounded-2xl p-4 animate-pulse h-[380px]"
                                style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
                            />
                        ))}
                    </div>
                ) : wishlist.length === 0 ? (
                    <div
                        className="rounded-2xl p-16 text-center max-w-2xl mx-auto"
                        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
                            style={{ background: 'rgba(232, 213, 176, 0.06)' }}
                        >
                            <Heart size={40} style={{ color: '#333' }} />
                        </div>
                        <h2 className="text-2xl font-black mb-4 tracking-tight" style={{ color: '#f5ede0' }}>
                            Your wishlist is empty
                        </h2>
                        <p className="mb-10 text-base" style={{ color: '#666' }}>
                            Start exploring our premium services and save your favorites here for later.
                        </p>
                        <Link
                            to={APP_ROUTES.SERVICES}
                            className="inline-flex items-center px-8 py-4 rounded-full font-bold transition-all group"
                            style={{ background: '#e8d5b0', color: '#111111' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f0e0c0')}
                            onMouseLeave={e => (e.currentTarget.style.background = '#e8d5b0')}
                        >
                            Explore Services
                            <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map(service => (
                            <ServiceCard
                                key={service.id || service._id}
                                service={service}
                                isFavorite={true}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
