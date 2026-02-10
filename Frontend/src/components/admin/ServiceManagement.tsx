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
        try {
            await serviceService.deleteService(id);
            toast.success('Service deleted successfully');
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
                const serviceId = editingService.id || (editingService as any)._id; // Fallback to _id
                await serviceService.updateService(serviceId, formDataToSend);
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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
                    <p className="text-sm text-gray-500">Total Services: {services.length}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search services..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleOpenAddModal}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center justify-center hover:bg-blue-700 transition-all shadow-sm"
                    >
                        <Plus size={18} className="mr-2" />
                        Add Service
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price / Day</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading...</td>
                                </tr>
                            ) : filteredServices.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No services found.</td>
                                </tr>
                            ) : (
                                filteredServices.map((service) => {
                                    const sId = service.id || (service as any)._id || '';
                                    return (
                                        <tr key={sId} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
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
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <Package size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{service.name}</p>
                                                        <p className="text-xs text-gray-500 line-clamp-1">{service.location}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[11px] font-semibold border border-gray-200">
                                                    {service.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                ₹{(service.pricePerDay || service.price || 0).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${service.isAvailable ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${service.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                                                    {service.isAvailable ? 'Available' : 'Unavailable'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleOpenEditModal(service)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteService(sId)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
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
                                    {editingService ? 'Update Service' : 'Create Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
