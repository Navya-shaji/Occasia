import React, { useState, useEffect } from 'react';
import serviceService, { Service } from '../services/serviceService';
import wishlistService from '../services/wishlistService';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import ServiceCard from '../components/ServiceCard';
import { useSelector } from 'react-redux';

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#e8d5b0',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
};

export default function ServicesPage() {
    const [searchParams] = useSearchParams();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);
    const { isAuthenticated } = useSelector((state: any) => state.auth);

    const [filters, setFilters] = useState({
        keyword: searchParams.get('keyword') || '',
        category: searchParams.get('category') || 'All',
        location: '',
        minPrice: '',
        maxPrice: '',
        sort: 'newest',
    });

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) setFilters(prev => ({ ...prev, category: categoryParam }));
    }, [searchParams]);

    useEffect(() => {
        fetchServices();
        if (isAuthenticated) fetchWishlist();
    }, [filters.category, filters.sort, isAuthenticated]);

    const fetchWishlist = async () => {
        try {
            const response = await wishlistService.getWishlist();
            const ids = response.data.map((item: any) => item.id || item._id);
            setWishlistIds(ids);
        } catch (error) {
            console.error('Error fetching wishlist', error);
        }
    };

    const toggleFavorite = (id: string) => {
        setWishlistIds(prev =>
            prev.includes(id) ? prev.filter(wishId => wishId !== id) : [...prev, id]
        );
    };

    const handleSearch = () => fetchServices();

    const fetchServices = async () => {
        setLoading(true);
        try {
            const params: any = {
                category: filters.category === 'All' ? undefined : filters.category,
                sort: filters.sort,
                keyword: filters.keyword,
                location: filters.location,
                minPrice: filters.minPrice || undefined,
                maxPrice: filters.maxPrice || undefined,
            };
            const response = await serviceService.getAllServices(params);
            setServices(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', 'Venue', 'Hotels', 'Resorts', 'Catering', 'Photography', 'Decoration', 'Music', 'Entertainment', 'Transportation'];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8" style={{ background: '#111111' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
                        <div
                            className="p-6 rounded-2xl"
                            style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}
                        >
                            <div className="flex items-center space-x-2 mb-6 font-semibold" style={{ color: '#e8d5b0' }}>
                                <SlidersHorizontal size={18} />
                                <span>Filters</span>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#666' }}>Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5" size={15} style={{ color: '#555' }} />
                                    <input
                                        type="text"
                                        placeholder="Keywords..."
                                        style={{ ...inputStyle, paddingLeft: '36px' }}
                                        value={filters.keyword}
                                        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        onFocus={e => (e.target.style.borderColor = 'rgba(232, 213, 176, 0.3)')}
                                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#666' }}>Category</label>
                                <div className="space-y-1">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setFilters({ ...filters, category: cat })}
                                            className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all"
                                            style={{
                                                background: filters.category === cat ? 'rgba(232, 213, 176, 0.12)' : 'transparent',
                                                color: filters.category === cat ? '#e8d5b0' : '#888',
                                                fontWeight: filters.category === cat ? '600' : '400',
                                                border: filters.category === cat ? '1px solid rgba(232, 213, 176, 0.2)' : '1px solid transparent',
                                            }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#666' }}>Price Range</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        style={inputStyle}
                                        value={filters.minPrice}
                                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                        onFocus={e => (e.target.style.borderColor = 'rgba(232, 213, 176, 0.3)')}
                                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                                    />
                                    <span style={{ color: '#444' }}>—</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        style={inputStyle}
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                        onFocus={e => (e.target.style.borderColor = 'rgba(232, 213, 176, 0.3)')}
                                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSearch}
                                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
                                style={{ background: '#e8d5b0', color: '#111111' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#f0e0c0')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#e8d5b0')}
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-black" style={{ color: '#f5ede0' }}>
                                {filters.category === 'All' ? 'All Services' : filters.category}
                            </h1>
                            <select
                                className="text-sm py-2 px-3 rounded-xl outline-none"
                                style={{
                                    background: '#1a1a1a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#c9b99a',
                                }}
                                value={filters.sort}
                                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                            >
                                <option value="newest">Newest First</option>
                                <option value="priceLow">Price: Low to High</option>
                                <option value="priceHigh">Price: High to Low</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div
                                        key={i}
                                        className="rounded-2xl p-4 animate-pulse h-72"
                                        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
                                    >
                                        <div className="h-40 rounded-xl mb-4" style={{ background: '#222' }} />
                                        <div className="h-4 rounded-lg w-3/4 mb-2" style={{ background: '#222' }} />
                                        <div className="h-4 rounded-lg w-1/2" style={{ background: '#222' }} />
                                    </div>
                                ))}
                            </div>
                        ) : services.length === 0 ? (
                            <div
                                className="rounded-2xl p-16 text-center"
                                style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}
                            >
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                    style={{ background: 'rgba(255,255,255,0.04)' }}
                                >
                                    <Search size={24} style={{ color: '#555' }} />
                                </div>
                                <h3 className="text-lg font-bold mb-2" style={{ color: '#f5ede0' }}>No services found</h3>
                                <p className="mb-6 text-sm" style={{ color: '#666' }}>Try adjusting your filters or search terms.</p>
                                <button
                                    onClick={() => setFilters({ keyword: '', category: 'All', location: '', minPrice: '', maxPrice: '', sort: 'newest' })}
                                    className="text-sm font-semibold transition-colors"
                                    style={{ color: '#e8d5b0' }}
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {services.map(service => (
                                    <ServiceCard
                                        key={service.id || (service as any)._id}
                                        service={service}
                                        isFavorite={wishlistIds.includes(service.id || (service as any)._id || '')}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
