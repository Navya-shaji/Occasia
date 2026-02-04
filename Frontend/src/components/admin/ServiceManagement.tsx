import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Package, X, Check, Image as ImageIcon, Upload } from 'lucide-react';
import serviceService, { Service } from '../../services/serviceService';
import toast from 'react-hot-toast';

export default function ServiceManagement() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const categories = ['Venue', 'Hotels', 'Resorts', 'Catering', 'Photography', 'Decoration', 'Music', 'Entertainment', 'Transportation'];


    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        pricePerDay: 0,
        category: '',
        location: '',
        isAvailable: true,
        contactDetails: {
            phone: '',
            email: '',
            address: ''
        }
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
            pricePerDay: 0,
            category: '',
            location: '',
            isAvailable: true,
            contactDetails: {
                phone: '',
                email: '',
                address: ''
            }
        });
        setImageFiles([]);
        setImagePreviews([]);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (service: Service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price,
            pricePerDay: service.pricePerDay || service.price,
            category: service.category,
            location: service.location || '',
            isAvailable: service.isAvailable,
            contactDetails: {
                phone: service.contactDetails?.phone || '',
                email: service.contactDetails?.email || '',
                address: service.contactDetails?.address || ''
            }
        });
        setImageFiles([]);
        setImagePreviews(service.images || []);
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + imageFiles.length > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }

        setImageFiles(prev => [...prev, ...files]);

        // Generate previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();

            // Append form fields
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.pricePerDay.toString());
            formDataToSend.append('pricePerDay', formData.pricePerDay.toString());
            formDataToSend.append('category', formData.category);
            formDataToSend.append('location', formData.location);
            formDataToSend.append('isAvailable', formData.isAvailable.toString());

            // Append contact details as nested fields
            formDataToSend.append('contactDetails[phone]', formData.contactDetails.phone);
            formDataToSend.append('contactDetails[email]', formData.contactDetails.email);
            formDataToSend.append('contactDetails[address]', formData.contactDetails.address || '');

            // Append image files
            imageFiles.forEach(file => {
                formDataToSend.append('images', file);
            });

            if (editingService) {
                await serviceService.updateService(editingService._id, formDataToSend);
                toast.success('Service updated');
            } else {
                await serviceService.createService(formDataToSend);
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
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Service Catalog</h3>
                    <p className="text-3xl font-black text-slate-900">Active Assets: <span className="text-blue-600 font-mono">{services.length}</span></p>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="relative w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Name or Category..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleOpenAddModal}
                        className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest flex items-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                        <Plus size={18} className="mr-2" />
                        Deploy New
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5">Service Profile</th>
                                <th className="px-8 py-5">Classification</th>
                                <th className="px-8 py-5">Valuation / Day</th>
                                <th className="px-8 py-5">Availability</th>
                                <th className="px-8 py-5 text-center">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center">
                                        <div className="inline-flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredServices.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center text-slate-400 italic font-medium">
                                        No services registered in the database.
                                    </td>
                                </tr>
                            ) : (
                                filteredServices.map((service) => (
                                    <tr key={service._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                                    {service.images?.[0] ? (
                                                        <img
                                                            src={service.images[0].startsWith('http')
                                                                ? service.images[0]
                                                                : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1212'}${service.images[0]}`
                                                            }
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="text-slate-400" size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900">{service.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium truncate max-w-[250px] italic">{service.location}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black tracking-widest uppercase border border-slate-200">
                                                {service.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-black text-slate-900">
                                            ₹{(service.pricePerDay || service.price).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6 text-[10px] font-black tracking-wider">
                                            <span className={`inline-flex items-center ${service.isAvailable ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${service.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                                {service.isAvailable ? 'ACTIVE' : 'OFFLINE'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center space-x-3">
                                                <button
                                                    onClick={() => handleOpenEditModal(service)}
                                                    className="w-9 h-9 flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                                                    title="Modify"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteService(service._id)}
                                                    className="w-9 h-9 flex items-center justify-center bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm"
                                                    title="Eliminate"
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

            {/* Simple Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden my-8">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Service Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none transition-all"
                                        placeholder="Service name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                                    <select
                                        required
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Location</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                        placeholder="Location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none resize-none"
                                        placeholder="Service description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price / Day (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                        value={formData.pricePerDay}
                                        onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value), price: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Phone</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                        value={formData.contactDetails.phone}
                                        onChange={(e) => setFormData({ ...formData, contactDetails: { ...formData.contactDetails, phone: e.target.value } })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                        value={formData.contactDetails.email}
                                        onChange={(e) => setFormData({ ...formData, contactDetails: { ...formData.contactDetails, email: e.target.value } })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Address</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                        value={formData.contactDetails.address}
                                        onChange={(e) => setFormData({ ...formData, contactDetails: { ...formData.contactDetails, address: e.target.value } })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Images</label>
                                    <div className="grid grid-cols-5 gap-2 mb-2">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                <img src={preview} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full shadow-md"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        {imagePreviews.length < 5 && (
                                            <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer">
                                                <Upload size={20} />
                                                <span className="text-[10px] font-bold mt-1">Add</span>
                                                <input type="file" className="hidden" multiple onChange={handleImageChange} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                                <div className="col-span-2 flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="isAvailable"
                                        checked={formData.isAvailable}
                                        onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">Available for booking</label>
                                </div>
                            </div>

                            <div className="pt-4 flex space-x-3 sticky bottom-0 bg-white pb-2 mt-4 border-t border-gray-100 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                                >
                                    {editingService ? 'Authorize Changes' : 'Confirm Deployment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
