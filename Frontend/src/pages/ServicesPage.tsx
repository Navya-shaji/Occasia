import React, { useState, useEffect } from 'react';
import serviceService, { Service } from '../services/serviceService';
import { Search, Filter, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await serviceService.getAllServices();
            setServices(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', ...new Set(services.map(s => s.category))];

    const filteredServices = services.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Hero / Header Section */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Our Services</h1>
                    <p className="text-lg text-slate-500 font-medium">Discover premium event management services curated for Occasia excellence.</p>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="What service are you looking for?"
                            className="w-full bg-slate-50 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 border border-transparent transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Services Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-[4/5] bg-slate-200 animate-pulse rounded-[2.5rem]"></div>
                        ))}
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="text-center py-40 space-y-6">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto">
                            <Package className="text-slate-200" size={32} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-slate-800">No services found</h3>
                            <p className="text-slate-400 text-sm font-medium">Try adjusting your search or filters.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map(service => (
                            <div
                                key={service._id}
                                className="group relative bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-600/5 hover:-translate-y-2 transition-all duration-500"
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
                                </div>

                                <div className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{service.name}</h3>
                                            <div className="text-indigo-600 font-bold">${service.price}</div>
                                        </div>
                                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
                                            {service.description}
                                        </p>
                                    </div>

                                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] group-hover:bg-indigo-600 transition-all shadow-lg shadow-black/5">
                                        Enquire Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
