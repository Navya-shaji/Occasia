import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Package, X, Check, Image as ImageIcon } from 'lucide-react';
import serviceService, { Service } from '../../services/serviceService';
import toast from 'react-hot-toast';

export default function ServiceManagement() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        isAvailable: true,
        images: [] as string[]
    });

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

    const handleOpenAddModal = () => {
        setEditingService(null);
        setFormData({
            name: '',
            description: '',
            price: 0,
            category: '',
            isAvailable: true,
            images: []
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (service: Service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price,
            category: service.category,
            isAvailable: service.isAvailable,
            images: service.images
        });
        setIsModalOpen(true);
    };

    const handleDeleteService = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            await serviceService.deleteService(id);
            toast.success('Service deleted');
            fetchServices();
        } catch (error) {
            toast.error('Failed to delete service');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingService) {
                await serviceService.updateService(editingService._id, formData);
                toast.success('Service updated');
            } else {
                await serviceService.createService(formData);
                toast.success('Service created');
            }
            setIsModalOpen(false);
            fetchServices();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 fade-in">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                        <Package className="text-indigo-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Service Catalog</h2>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
                            Available Services: <span className="text-indigo-600 ml-1">{services.length}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-4 w-full lg:w-auto">
                    <div className="relative group flex-1 lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find service..."
                            className="search-input-premium w-full outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleOpenAddModal}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Service
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="user-table-container">
                <div className="overflow-x-auto">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Service Detail</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th className="text-right">Manage Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Loading Catalog...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredServices.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">No services in current manifest.</div>
                                    </td>
                                </tr>
                            ) : (
                                filteredServices.map((service) => (
                                    <tr key={service._id}>
                                        <td>
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                                                    {service.images?.[0] ? (
                                                        <img src={service.images[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="text-slate-300" size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm tracking-tight">{service.name}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate max-w-[200px]">{service.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-wider">{service.category}</span>
                                        </td>
                                        <td>
                                            <div className="font-bold text-indigo-600 text-sm">${service.price}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase">Base Rate</div>
                                        </td>
                                        <td>
                                            <div className={`status-pill ${service.isAvailable ? 'active' : 'blocked'}`}>
                                                {service.isAvailable ? 'Operational' : 'Off-line'}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(service)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteService(service._id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
                    <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 tracking-tight">{editingService ? 'Modify Service' : 'Instantiate Service'}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registry Entry Control</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Service Designation</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                        placeholder="e.g. Royal Banquet Decoration"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Category</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                        placeholder="e.g. Decoration"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Base Rate ($)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Manifest Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none resize-none"
                                        placeholder="Describe the service capabilities..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Operational Status</label>
                                    <div className="flex items-center space-x-3">
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={formData.isAvailable}
                                                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{formData.isAvailable ? 'Fully Available' : 'Currently Deactivated'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-2 py-4 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                >
                                    {editingService ? 'Commit Changes' : 'Initialize Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
