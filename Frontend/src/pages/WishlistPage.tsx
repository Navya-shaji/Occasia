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
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-4 mb-10">
                    <div className="bg-red-100 p-3 rounded-2xl">
                        <Heart className="text-red-600" size={32} fill="currentColor" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">My Wishlist</h1>
                        <p className="text-gray-500 font-medium">Your curated collection of premium experiences</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse h-[400px]" />
                        ))}
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-gray-100 p-16 text-center max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Heart className="text-red-200" size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-tight">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-10 text-lg">Start exploring our premium services and save your favorites here for later.</p>
                        <Link
                            to={APP_ROUTES.SERVICES}
                            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 group"
                        >
                            Explore Services
                            <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
