import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingService, { Booking } from '../services/bookingService';
import {
    Calendar,
    MapPin,
    Clock,
    CheckCircle2,
    ArrowLeft,
    Image as ImageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { APP_ROUTES } from '../constants/routes';

export default function BookingDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchBooking(id);
    }, [id]);

    const fetchBooking = async (bookingId: string) => {
        try {
            const response = await bookingService.getBookingById(bookingId);
            setBooking(response.data);
        } catch (error) {
            toast.error('Failed to load booking details');
            navigate(APP_ROUTES.MY_BOOKINGS);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string): React.CSSProperties => {
        switch (status) {
            case 'CONFIRMED': return { background: 'rgba(110, 231, 183, 0.12)', color: '#6ee7b7', border: '1px solid rgba(110, 231, 183, 0.25)' };
            case 'CANCELLED': return { background: 'rgba(255, 107, 107, 0.12)', color: '#ff6b6b', border: '1px solid rgba(255, 107, 107, 0.25)' };
            default: return { background: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.25)' };
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return <CheckCircle2 size={16} />;
            default: return <Clock size={16} />;
        }
    };

    if (loading) return (
        <div className="min-h-screen pt-32 flex items-center justify-center" style={{ background: '#111' }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#e8d5b0' }}></div>
        </div>
    );

    if (!booking) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8" style={{ background: '#111111' }}>
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(APP_ROUTES.MY_BOOKINGS)}
                    className="flex items-center space-x-2 mb-6 text-sm font-medium transition-colors"
                    style={{ color: '#666' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#e8d5b0')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#666')}
                >
                    <ArrowLeft size={18} />
                    <span>Back to My Bookings</span>
                </button>

                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                    {/* Header Image */}
                    <div className="h-64 relative" style={{ background: '#222' }}>
                        {(booking.service?.images?.[0] || booking.serviceImage) ? (
                            <img
                                src={(booking.service?.images?.[0] || booking.serviceImage || '').startsWith('http')
                                    ? (booking.service?.images?.[0] || booking.serviceImage)
                                    : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1212'}${booking.service?.images?.[0] || booking.serviceImage}`}
                                alt={booking.service?.name || booking.serviceName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ color: '#444' }}>
                                <ImageIcon size={64} />
                            </div>
                        )}
                        <div className="absolute top-4 left-4">
                            <span
                                className="px-4 py-1.5 rounded-full text-sm font-bold flex items-center space-x-2"
                                style={{
                                    ...getStatusStyle(booking.status),
                                    backdropFilter: 'blur(8px)',
                                    background: 'rgba(17,17,17,0.85)',
                                    color: getStatusStyle(booking.status).color,
                                    border: getStatusStyle(booking.status).border,
                                }}
                            >
                                {getStatusIcon(booking.status)}
                                <span>{booking.status}</span>
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Title */}
                        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl font-black mb-2" style={{ color: '#f5ede0' }}>
                                    {booking.serviceName || booking.service?.name || 'Booking Details'}
                                </h1>
                                <div className="flex items-center text-sm" style={{ color: '#888' }}>
                                    <MapPin size={16} className="mr-2" style={{ color: '#666' }} />
                                    {booking.location || booking.service?.location || 'Location Not Provided'}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm mb-1" style={{ color: '#666' }}>Total Booking Amount</p>
                                <p className="text-3xl font-black" style={{ color: '#e8d5b0' }}>₹{booking.totalPrice}</p>
                            </div>
                        </div>

                        <div className="max-w-2xl">
                            <h3
                                className="text-lg font-bold pb-3 mb-6"
                                style={{ color: '#f5ede0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                            >
                                Booking Information
                            </h3>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div
                                        className="p-3 rounded-xl mr-4 flex-shrink-0"
                                        style={{ background: 'rgba(232, 213, 176, 0.08)' }}
                                    >
                                        <Calendar size={22} style={{ color: '#e8d5b0' }} />
                                    </div>
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: '#666' }}>Dates</p>
                                        <p className="font-semibold" style={{ color: '#f5ede0' }}>
                                            {new Date(booking.startDate).toDateString()} — {new Date(booking.endDate).toDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div
                                        className="p-3 rounded-xl mr-4 flex-shrink-0"
                                        style={{ background: 'rgba(147, 197, 253, 0.08)' }}
                                    >
                                        <Clock size={22} style={{ color: '#93c5fd' }} />
                                    </div>
                                    <div>
                                        <p className="text-sm mb-1" style={{ color: '#666' }}>Booking Reference</p>
                                        <p className="font-mono font-bold tracking-wider" style={{ color: '#f5ede0' }}>
                                            #{String(booking.id || (booking as any)._id || 'N/A').slice(-8).toUpperCase()}
                                        </p>
                                        <p className="text-xs mt-1" style={{ color: '#555' }}>
                                            Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
