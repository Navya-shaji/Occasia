import React, { useState, useEffect } from 'react';
import serviceService, { Service } from '../services/serviceService';
import { Search, Filter, Package, MapPin, ChevronLeft, ChevronRight, SlidersHorizontal, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(6);

    // Filter States
    const [filters, setFilters] = useState({
        keyword: '',
        category: 'All',
        location: '',
        minPrice: '',
        maxPrice: '',
        sort: 'newest',
        date: ''
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        fetchServices();
    }, [page, filters.category, filters.sort]); // Fetch on page, category, sort change immediately

    // For other filters like keyword and price, we might want to debounce or use a "Search" button
    const handleSearchClick = () => {
        setPage(1);
        fetchServices();
    };

    const fetchServices = async () => {
        setLoading(true);
        try {
            const params: any = {
                page,
                limit,
                category: filters.category === 'All' ? undefined : filters.category,
                sort: filters.sort,
                keyword: filters.keyword,
                location: filters.location,
                minPrice: filters.minPrice || undefined,
                maxPrice: filters.maxPrice || undefined
            };

            const response = await serviceService.getAllServices(params);
            setServices(Array.isArray(response.data) ? response.data : []);
            setTotal(response.total || 0);
        } catch (error) {
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', 'Decoration', 'Catering', 'Photography', 'Venue', 'Music', 'Entertainment'];

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 px-6">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Hero / Header Section */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Experience Occasia</h1>
                    <p className="text-lg text-slate-500 font-medium">Curated world-class services for your most prestigious events.</p>
                </div>

                {/* Search & Filter Bar */}
                <div className="space-y-6">
                    <div className="bg-white p-4 md:p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 items-center">
                        <div className="relative flex-1 group w-full">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search services, vendors, or styles..."
                                className="w-full bg-slate-50 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 border border-transparent transition-all"
                                value={filters.keyword}
                                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearchClick()}
                            />
                        </div>

                        <div className="flex items-center space-x-3 w-full lg:w-auto overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                            <div className="relative min-w-[150px]">
                                <select
                                    className="w-full bg-slate-50 rounded-2xl py-4 px-6 text-sm font-bold uppercase tracking-widest outline-none border border-transparent focus:bg-white transition-all appearance-none text-slate-600"
                                    value={filters.sort}
                                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="priceLow">Price: Low to High</option>
                                    <option value="priceHigh">Price: High to Low</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`flex items-center space-x-2 px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${isFilterOpen ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                            >
                                <SlidersHorizontal size={16} />
                                <span>Advanced Filters</span>
                            </button>

                            <button
                                onClick={handleSearchClick}
                                className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-black/5"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Expandable Advanced Filters */}
                    {isFilterOpen && (
                        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-in slide-in-from-top duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Category</label>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setFilters({ ...filters, category: cat })}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${filters.category === cat ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-50 text-slate-400 border border-transparent hover:bg-slate-100'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location Preference</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="City, State..."
                                            className="w-full bg-slate-50 rounded-xl py-3 pl-11 pr-4 text-xs font-medium outline-none focus:bg-white border border-transparent focus:border-indigo-100 transition-all"
                                            value={filters.location}
                                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price Range</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            className="w-full bg-slate-50 rounded-xl py-3 px-4 text-xs font-medium outline-none focus:bg-white border border-transparent focus:border-indigo-100 transition-all"
                                            value={filters.minPrice}
                                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                        />
                                        <span className="text-slate-300 text-xs">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            className="w-full bg-slate-50 rounded-xl py-3 px-4 text-xs font-medium outline-none focus:bg-white border border-transparent focus:border-indigo-100 transition-all"
                                            value={filters.maxPrice}
                                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Event Date</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 rounded-xl py-3 pl-11 pr-4 text-xs font-medium outline-none focus:bg-white border border-transparent focus:border-indigo-100 transition-all"
                                            value={filters.date}
                                            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Services Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-1">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-[4/5] bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-6">
                                <div className="aspect-[4/3] bg-slate-100 animate-pulse rounded-3xl" />
                                <div className="h-4 w-3/4 bg-slate-100 animate-pulse rounded-full" />
                                <div className="h-12 w-full bg-slate-100 animate-pulse rounded-2xl" />
                            </div>
                        ))}
                    </div>
                ) : services.length === 0 ? (
                    <div className="text-center py-40 space-y-6">
                        <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto transition-transform hover:scale-110">
                            <Package className="text-slate-200" size={40} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-slate-800">No Services Available</h3>
                            <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto">We couldn't find any services matching your current preferences.</p>
                        </div>
                        <button
                            onClick={() => {
                                setFilters({ keyword: '', category: 'All', location: '', minPrice: '', maxPrice: '', sort: 'newest', date: '' });
                                setPage(1);
                            }}
                            className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-200 hover:border-indigo-600 pb-1 pt-4 transition-all"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {services.map(service => (
                            <div
                                key={service._id}
                                className="group relative bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-600/10 hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                                    {service.images?.[0] ? (
                                        <img src={service.images[0]} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="text-slate-200" size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-800 shadow-sm">
                                        {service.category}
                                    </div>
                                    <button className="absolute top-6 right-6 w-10 h-10 bg-white/50 hover:bg-white backdrop-blur-md rounded-xl flex items-center justify-center text-slate-800 transition-all">
                                        <SlidersHorizontal size={16} />
                                    </button>
                                </div>

                                <div className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{service.name}</h3>
                                            <div className="text-indigo-600 font-bold text-lg">${service.price}</div>
                                        </div>

                                        <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            <div className="flex items-center space-x-1">
                                                <MapPin size={12} className="text-indigo-400" />
                                                <span>{service.location || 'Remote'}</span>
                                            </div>
                                            <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                            <span>Premium Status</span>
                                        </div>

                                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
                                            {service.description}
                                        </p>
                                    </div>

                                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] group-hover:bg-indigo-600 transition-all shadow-lg shadow-black/5 flex items-center justify-center space-x-2">
                                        <span>Enquire Details</span>
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 pt-12">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex items-center space-x-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-12 h-12 rounded-2xl text-xs font-bold transition-all ${page === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
