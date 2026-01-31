import React, { useState, useEffect } from 'react';
import serviceService, { Service } from '../services/serviceService';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, Star, Image as ImageIcon } from 'lucide-react';
import { APP_ROUTES } from '../constants/routes';
import toast from 'react-hot-toast';

export default function ServicesPage() {
    const [searchParams] = useSearchParams();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);

    // Initial state from URL params
    const [filters, setFilters] = useState({
        keyword: searchParams.get('keyword') || '',
        category: searchParams.get('category') || 'All',
        location: '',
        minPrice: '',
        maxPrice: '',
        sort: 'newest'
    });

    useEffect(() => {
        // Update category if URL changes (e.g. from nav link)
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setFilters(prev => ({ ...prev, category: categoryParam }));
        }
    }, [searchParams]);

    useEffect(() => {
        fetchServices();
    }, [filters.category, filters.sort]); // Fetch on category/sort change

    // Debounced search could go here, but for now button/enter works
    const handleSearch = () => {
        fetchServices();
    };

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
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex items-center space-x-2 mb-6 text-gray-900 font-semibold">
                                <SlidersHorizontal size={20} />
                                <span>Filters</span>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-xs font-medium text-gray-700 mb-2">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Keywords..."
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500"
                                        value={filters.keyword}
                                        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setFilters({ ...filters, category: cat })}
                                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${filters.category === cat
                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-xs font-medium text-gray-700 mb-2">Price Range</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500"
                                        value={filters.minPrice}
                                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500"
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSearch}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {filters.category === 'All' ? 'All Services' : filters.category}
                            </h1>
                            <select
                                className="bg-white border border-gray-200 rounded-md text-sm py-2 px-3 focus:outline-none focus:border-blue-500"
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
                                    <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse">
                                        <div className="h-48 bg-gray-200 rounded-md mb-4" />
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : services.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="text-gray-400" size={24} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
                                <button
                                    onClick={() => setFilters({ keyword: '', category: 'All', location: '', minPrice: '', maxPrice: '', sort: 'newest' })}
                                    className="text-blue-600 font-medium hover:text-blue-700"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {services.map(service => (
                                    <Link
                                        to={APP_ROUTES.SERVICE_DETAILS.replace(':id', service._id)}
                                        key={service._id}
                                        className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                                            {service.images?.[0] ? (
                                                <img
                                                    src={service.images[0].startsWith('http') ? service.images[0] : `http://localhost:1212${service.images[0]}`}
                                                    alt={service.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <ImageIcon size={32} />
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-800">
                                                {service.category}
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{service.name}</h3>
                                                <div className="flex items-center text-yellow-400 text-xs font-bold">
                                                    <Star size={12} fill="currentColor" className="mr-1" />
                                                    4.8
                                                </div>
                                            </div>
                                            <div className="flex items-center text-gray-500 text-sm mb-4">
                                                <MapPin size={14} className="mr-1" />
                                                {service.location || 'Location varies'}
                                            </div>
                                            <div className="flex items-end justify-between">
                                                <div>
                                                    <span className="text-xl font-bold text-blue-600">₹{service.pricePerDay || service.price}</span>
                                                    <span className="text-xs text-gray-500 ml-1">/ day</span>
                                                </div>
                                                <span className="text-sm font-medium text-blue-600 group-hover:underline">View Details</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
