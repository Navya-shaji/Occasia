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
} from 'lucide-react';
import toast from 'react-hot-toast';
import { APP_ROUTES } from '../constants/routes';

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#e8d5b0',
    fontSize: '14px',
    outline: 'none',
};

export default function ServiceDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

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
                endDate: dateRange.endDate,
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
        <div className="min-h-screen pt-32 flex items-center justify-center" style={{ background: '#111' }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#e8d5b0' }}></div>
        </div>
    );

    if (!service) return null;

    const totalPrice = calculateTotalPrice();

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8" style={{ background: '#111111' }}>
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 mb-6 transition-colors text-sm font-medium"
                    style={{ color: '#888' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#e8d5b0')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#888')}
                >
                    <ArrowLeft size={18} />
                    <span>Back to Services</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Images & Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden relative" style={{ background: '#1a1a1a' }}>
                                {service.images?.[0] ? (
                                    <img
                                        src={service.images[0].startsWith('http') ? service.images[0] : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1212'}${service.images[0]}`}
                                        alt={service.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center" style={{ color: '#444' }}>
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div
                                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold"
                                    style={{
                                        background: 'rgba(17,17,17,0.85)',
                                        backdropFilter: 'blur(8px)',
                                        color: '#e8d5b0',
                                        border: '1px solid rgba(232, 213, 176, 0.2)',
                                    }}
                                >
                                    {service.category}
                                </div>
                            </div>

                            {service.images && service.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {service.images.slice(1, 5).map((img, i) => (
                                        <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer" style={{ background: '#1a1a1a' }}>
                                            <img
                                                src={img.startsWith('http') ? img : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1212'}${img}`}
                                                className="w-full h-full object-cover hover:opacity-80 transition-opacity"
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
                                    <h1 className="text-3xl font-black mb-2" style={{ color: '#f5ede0' }}>{service.name}</h1>
                                    <div className="flex items-center space-x-4 text-sm" style={{ color: '#888' }}>
                                        <div className="flex items-center">
                                            <MapPin size={15} className="mr-1" style={{ color: '#666' }} />
                                            {service.location}
                                        </div>
                                        <div
                                            className="flex items-center font-semibold px-2 py-0.5 rounded-lg"
                                            style={{ background: 'rgba(232, 213, 176, 0.1)', color: '#e8d5b0' }}
                                        >
                                            <Star size={14} fill="currentColor" className="mr-1" />
                                            {service.averageRating || '4.8'} ({service.numReviews || 0} reviews)
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black" style={{ color: '#e8d5b0' }}>₹{service.pricePerDay}</div>
                                    <div className="text-sm" style={{ color: '#666' }}>per day / session</div>
                                </div>
                            </div>

                            <hr style={{ borderColor: 'rgba(255,255,255,0.07)' }} className="my-6" />

                            <div className="mb-8">
                                <h3 className="text-lg font-bold mb-3" style={{ color: '#f5ede0' }}>About this Service</h3>
                                <p className="leading-relaxed text-sm" style={{ color: '#999' }}>{service.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {[
                                    { icon: <ShieldCheck size={22} style={{ color: '#6ee7b7' }} />, title: 'Verified Vendor', sub: 'Identity and service verified', bg: 'rgba(110, 231, 183, 0.08)' },
                                    { icon: <Clock size={22} style={{ color: '#93c5fd' }} />, title: 'Responsive', sub: 'Responds within 24 hours', bg: 'rgba(147, 197, 253, 0.08)' },
                                ].map(item => (
                                    <div
                                        key={item.title}
                                        className="flex items-center p-4 rounded-xl space-x-3"
                                        style={{ background: item.bg, border: '1px solid rgba(255,255,255,0.06)' }}
                                    >
                                        {item.icon}
                                        <div>
                                            <p className="font-semibold text-sm" style={{ color: '#f5ede0' }}>{item.title}</p>
                                            <p className="text-xs" style={{ color: '#777' }}>{item.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Contact */}
                            <div>
                                <h3 className="text-lg font-bold mb-4" style={{ color: '#f5ede0' }}>Contact Vendor</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { icon: <Phone size={18} />, label: 'Phone', value: service.contactDetails?.phone || 'Not available' },
                                        { icon: <Mail size={18} />, label: 'Email', value: service.contactDetails?.email || 'Not available' },
                                    ].map(item => (
                                        <div
                                            key={item.label}
                                            className="flex items-center space-x-3 p-4 rounded-xl"
                                            style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}
                                        >
                                            <div
                                                className="p-2 rounded-lg"
                                                style={{ background: 'rgba(232, 213, 176, 0.1)', color: '#e8d5b0' }}
                                            >
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-xs" style={{ color: '#666' }}>{item.label}</p>
                                                <p className="font-medium text-sm" style={{ color: '#e8d5b0' }}>{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <hr style={{ borderColor: 'rgba(255,255,255,0.07)' }} className="my-10" />

                            {/* Reviews */}
                            <div>
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-2xl font-black mb-1" style={{ color: '#f5ede0' }}>Guest Experiences</h3>
                                        <p className="text-sm" style={{ color: '#666' }}>Real stories from real users</p>
                                    </div>
                                    <div
                                        className="flex items-center px-4 py-2 rounded-xl font-black"
                                        style={{ background: 'rgba(232, 213, 176, 0.12)', color: '#e8d5b0', border: '1px solid rgba(232, 213, 176, 0.2)' }}
                                    >
                                        <Star size={18} fill="currentColor" className="mr-2" />
                                        {service.averageRating || '4.8'}
                                    </div>
                                </div>

                                {reviews.length === 0 ? (
                                    <div
                                        className="rounded-2xl p-14 text-center"
                                        style={{ background: '#1a1a1a', border: '1px dashed rgba(255,255,255,0.1)' }}
                                    >
                                        <p className="font-semibold" style={{ color: '#555' }}>No reviews yet. Be the first to share your experience!</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {reviews.map((review) => (
                                            <div
                                                key={review._id}
                                                className="p-6 rounded-2xl transition-all duration-300"
                                                style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div
                                                            className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg"
                                                            style={{ background: '#e8d5b0', color: '#111' }}
                                                        >
                                                            {(review.user?.name || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold" style={{ color: '#f5ede0' }}>{review.user?.name || 'Anonymous User'}</p>
                                                            <p className="text-xs" style={{ color: '#555' }}>
                                                                {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex" style={{ color: '#e8d5b0' }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={14}
                                                                fill={i < review.rating ? 'currentColor' : 'none'}
                                                                style={{ color: i < review.rating ? '#e8d5b0' : '#333' }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm leading-relaxed" style={{ color: '#999' }}>{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28">
                            <div
                                className="p-6 rounded-2xl"
                                style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}
                            >
                                <h3 className="text-xl font-bold mb-6" style={{ color: '#f5ede0' }}>Book this Service</h3>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#666' }}>Start Date</label>
                                        <input
                                            type="date"
                                            style={inputStyle}
                                            value={dateRange.startDate}
                                            min={getMinDate()}
                                            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                                            onFocus={e => (e.target.style.borderColor = 'rgba(232, 213, 176, 0.4)')}
                                            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: '#666' }}>End Date</label>
                                        <input
                                            type="date"
                                            style={inputStyle}
                                            value={dateRange.endDate}
                                            min={dateRange.startDate || getMinDate()}
                                            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                                            onFocus={e => (e.target.style.borderColor = 'rgba(232, 213, 176, 0.4)')}
                                            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                                        />
                                    </div>
                                </div>

                                {totalPrice > 0 && (
                                    <div
                                        className="mb-6 p-4 rounded-xl"
                                        style={{ background: 'rgba(232, 213, 176, 0.06)', border: '1px solid rgba(232, 213, 176, 0.12)' }}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm" style={{ color: '#888' }}>Total Price</span>
                                            <span className="text-xl font-black" style={{ color: '#e8d5b0' }}>₹{totalPrice}</span>
                                        </div>
                                        <p className="text-xs" style={{ color: '#555' }}>Includes taxes and fees</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleBooking}
                                    disabled={bookingLoading}
                                    className="w-full py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ background: '#e8d5b0', color: '#111111' }}
                                    onMouseEnter={e => !bookingLoading && (e.currentTarget.style.background = '#f0e0c0')}
                                    onMouseLeave={e => (e.currentTarget.style.background = '#e8d5b0')}
                                >
                                    {bookingLoading ? (
                                        <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(17,17,17,0.3)', borderTopColor: '#111' }} />
                                    ) : (
                                        <>
                                            <span>Request Booking</span>
                                            <CheckCircle2 size={18} />
                                        </>
                                    )}
                                </button>

                                <p className="mt-4 text-xs text-center" style={{ color: '#555' }}>
                                    You won't be charged yet
                                </p>
                            </div>

                            <div
                                className="mt-4 flex items-start space-x-3 p-4 rounded-xl"
                                style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}
                            >
                                <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#666' }} />
                                <p className="text-xs" style={{ color: '#777' }}>
                                    <span className="font-semibold" style={{ color: '#c9b99a' }}>Secure Booking</span>
                                    <br />
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
