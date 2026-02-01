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
                                <th>Category / Location</th>
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
                                                        <img src={service.images[0].startsWith('http') ? service.images[0] : `http://localhost:1212${service.images[0]}`} alt="" className="w-full h-full object-cover" />
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
                                            <div className="flex flex-col space-y-1">
                                                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-wider w-fit">{service.category}</span>
                                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter pl-1">{service.location}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-bold text-indigo-600 text-sm">₹{service.price}</div>
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-8">
                        <div className="sticky top-0 z-10 p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 tracking-tight">{editingService ? 'Modify Service' : 'Instantiate Service'}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registry Entry Control</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(100vh-8rem)]">
                            <div className="overflow-y-auto px-8 py-6 space-y-6">
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
                                        <select
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none appearance-none"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="" disabled>Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Location</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                            placeholder="e.g. New York, NY"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Price Per Day (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                            placeholder="0.00"
                                            value={formData.pricePerDay}
                                            onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value), price: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Contact Phone</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                            placeholder="+1..."
                                            value={formData.contactDetails.phone}
                                            onChange={(e) => setFormData({ ...formData, contactDetails: { ...formData.contactDetails, phone: e.target.value } })}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 block">Contact Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-medium focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none"
                                            placeholder="admin@..."
                                            value={formData.contactDetails.email}
                                            onChange={(e) => setFormData({ ...formData, contactDetails: { ...formData.contactDetails, email: e.target.value } })}
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
                                        <label className="text-xs font-medium text-gray-700 mb-2 block flex items-center space-x-2">
                                            <ImageIcon size={16} />
                                            <span>Service Images</span>
                                        </label>
                                        <div className="space-y-3">
                                            {/* Image Previews */}
                                            {imagePreviews.length > 0 && (
                                                <div className="grid grid-cols-5 gap-3">
                                                    {imagePreviews.map((preview, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={preview.startsWith('data:') || preview.startsWith('http') ? preview : `http://localhost:1212${preview}`}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveImage(index)}
                                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Upload Button */}
                                            {imagePreviews.length < 5 && (
                                                <label className="w-full py-4 bg-gray-50 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg font-medium text-sm hover:bg-gray-100 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center space-x-2 cursor-pointer">
                                                    <Upload size={18} />
                                                    <span>Upload Images (Max 5)</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleImageChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                            <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF, WebP (Max 5MB each)</p>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-medium text-gray-700 mb-2 block">Operational Status</label>
                                        <div className="flex items-center space-x-3">
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isAvailable}
                                                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                            <span className="text-sm font-medium text-gray-600">{formData.isAvailable ? 'Available' : 'Unavailable'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white border-t border-slate-100 p-8 flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-100 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
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
