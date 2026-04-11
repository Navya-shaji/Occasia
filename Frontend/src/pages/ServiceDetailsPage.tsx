import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import serviceService, { Service } from '../services/serviceService';
import bookingService from '../services/bookingService';
import reviewService from '../services/reviewService';
import {
    MapPin,
    Calendar,
    Phone,
    Mail,
    ArrowLeft,
    Clock,
    CheckCircle2,
    Star,
    ShieldCheck,
    Image as ImageIcon,
    User
} from 'lucide-react';
import toast from 'react-hot-toast';
import { APP_ROUTES } from '../constants/routes';

export default function ServiceDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        if (id) {
            fetchService(id);
            fetchReviews(id);
        }
    }, [id]);

    const fetchReviews = async (serviceId: string) => {
        try {
            const response = await reviewService.getReviewsByService(serviceId);
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews', error);
        }
    };

    const fetchService = async (serviceId: string) => {
        try {
            const response = await serviceService.getServiceById(serviceId);
            setService(response.data);
        } catch (error) {
            toast.error('Failed to load service details');
            navigate(APP_ROUTES.SERVICES);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotalPrice = () => {
        if (!dateRange.startDate || !dateRange.endDate || !service) return 0;
        if (!service.pricePerDay || service.pricePerDay <= 0) return 0;

        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        if (start > end) return 0;

        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const total = diffDays * service.pricePerDay;

        return isNaN(total) ? 0 : total;
    };


    const getMinDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        return today.toISOString().split('T')[0];
    };

    const handleBooking = async () => {
        if (!dateRange.startDate || !dateRange.endDate) {
            toast.error('Please select both start and end dates');
            return;
        }

        const totalPrice = calculateTotalPrice();
        if (!totalPrice || totalPrice <= 0) {
            toast.error('Invalid booking price. Please check service pricing.');
            return;
        }

        if (!service?.pricePerDay) {
            toast.error('Service pricing information is missing');
            return;
        }

        setBookingLoading(true);
        try {
            await bookingService.createBooking({
                serviceId: id!,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            });
            toast.success('Booking requested successfully!');
            navigate(APP_ROUTES.MY_BOOKINGS);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create booking');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen pt-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!service) return null;

    const totalPrice = calculateTotalPrice();

    return (
        <div className="min-h-screen bg-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors mb-6"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back to Services</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Side: Images and Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-[16/9] w-full bg-gray-100 rounded-2xl overflow-hidden relative">
                                {service.images?.[0] ? (
                                    <img
                                        src={service.images[0].startsWith('http') ? service.images[0] : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1212'}${service.images[0]}`}
                                        alt={service.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-900 shadow-sm">
                                    {service.category}
                                </div>
                            </div>

                            {service.images && service.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {service.images.slice(1, 5).map((img, i) => (
                                        <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-gray-100">
                                            <img
                                                src={img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1212'}${img}`}
                                                className="w-full h-full object-cover"
                                                alt={`Gallery ${i}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Title & Description */}
                        <div>
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <MapPin size={16} className="mr-1 text-gray-400" />
                                            {service.location}
                                        </div>
                                        <div className="flex items-center text-yellow-500 font-medium bg-yellow-50 px-2 py-0.5 rounded-md">
                                            <Star size={16} fill="currentColor" className="mr-1" />
                                            {service.averageRating || '4.8'} ({service.numReviews || 0} reviews)
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-blue-600">₹{service.pricePerDay}</div>
                                    <div className="text-sm text-gray-500">per day / session</div>
                                </div>
                            </div>

                            <hr className="border-gray-100 my-6" />

                            <div className="prose max-w-none text-gray-600 mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">About this Service</h3>
                                <p className="leading-relaxed">{service.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center p-4 bg-gray-50 rounded-xl space-x-3">
                                    <ShieldCheck className="text-green-600" size={24} />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Verified Vendor</p>
                                        <p className="text-xs text-gray-500">Identity and service verified</p>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 bg-gray-50 rounded-xl space-x-3">
                                    <Clock className="text-blue-600" size={24} />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Responsive</p>
                                        <p className="text-xs text-gray-500">Responds within 24 hours</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Vendor</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl">
                                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Phone</p>
                                            <p className="font-medium text-gray-900">{service.contactDetails?.phone || 'Not available'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl">
                                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="font-medium text-gray-900">{service.contactDetails?.email || 'Not available'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100 my-12" />

                            {/* Reviews Section */}
                            <div>
                                <div className="flex justify-between items-center mb-10">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-1">Guest Experiences</h3>
                                        <p className="text-gray-500 text-sm font-medium">Real stories from real users</p>
                                    </div>
                                    <div className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-blue-200 font-black">
                                        <Star size={20} fill="currentColor" className="mr-2 text-yellow-400" />
                                        {service.averageRating || '4.8'}
                                    </div>
                                </div>

                                {reviews.length === 0 ? (
                                    <div className="bg-slate-50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
                                        <p className="text-slate-400 text-lg font-bold">No reviews yet. Be the first to share your experience!</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-6">
                                        {reviews.map((review) => (
                                            <div key={review._id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">
                                                            {(review.user?.name || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-gray-900 text-lg">{review.user?.name || 'Anonymous User'}</p>
                                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest bg-slate-50 px-2 py-1 rounded inline-block mt-1">
                                                                {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex text-yellow-400 bg-yellow-50 p-2 rounded-xl border border-yellow-100">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={16}
                                                                fill={i < review.rating ? 'currentColor' : 'none'}
                                                                className={i < review.rating ? 'stroke-yellow-400' : 'stroke-gray-300 text-transparent'}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute -top-4 -left-2 text-6xl text-blue-50 opacity-10 font-serif">"</span>
                                                    <p className="text-gray-600 leading-relaxed text-lg font-medium relative z-10 pl-2">
                                                        {review.comment}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Booking Form Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28">
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Book this Service</h3>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                                            value={dateRange.startDate}
                                            min={getMinDate()}
                                            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border"
                                            value={dateRange.endDate}
                                            min={dateRange.startDate || getMinDate()}
                                            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {totalPrice > 0 && (
                                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-600">Total Price</span>
                                            <span className="text-xl font-bold text-blue-600">₹{totalPrice}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">Includes taxes and fees</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleBooking}
                                    disabled={bookingLoading}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {bookingLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Request Booking</span>
                                            <CheckCircle2 size={18} />
                                        </>
                                    )}
                                </button>

                                <p className="mt-4 text-xs text-center text-gray-500">
                                    You won't be charged yet
                                </p>
                            </div>

                            <div className="mt-6 flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                                <ShieldCheck className="text-gray-400 flex-shrink-0" size={20} />
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-gray-900">Secure Booking</span><br />
                                    Your personal information is protected with bank-level security.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
