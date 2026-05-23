import React, { useState, useEffect } from 'react';
import bookingService, { Booking } from '../services/bookingService';
import reviewService from '../services/reviewService';
import ReviewModal from '../components/ReviewModal';
import {
    Calendar,
    MapPin,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Image as ImageIcon,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { APP_ROUTES } from '../constants/routes';
import toast from 'react-hot-toast';

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
    const [reviewedBookingIds, setReviewedBookingIds] = useState<string[]>([]);
    const [selectedBookingForReview, setSelectedBookingForReview] = useState<any | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
        fetchMyReviews();
    }, []);

    const fetchMyReviews = async () => {
        try {
            const response = await reviewService.getMyReviews();
            const ids = response.data.map((r: any) => r.booking?._id || r.booking);
            setReviewedBookingIds(ids);
        } catch (error) {
            console.error('Error fetching my reviews', error);
        }
    };

    const fetchBookings = async () => {
        try {
            const response = await bookingService.getMyBookings();
            const sortedBookings = [...response.data].sort((a, b) =>
                new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            );
            setBookings(sortedBookings);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const upcomingBookings = bookings.filter(b => new Date(b.endDate) >= new Date() && b.status !== 'CANCELLED');
    const pastBookings = bookings.filter(b => new Date(b.endDate) < new Date() || b.status === 'CANCELLED');
    const displayBookings = activeTab === 'UPCOMING' ? upcomingBookings : pastBookings;

    const handleCancel = async (id: string) => {
        try {
            await bookingService.cancelBooking(id);
            toast.success('Booking cancelled successfully');
            fetchBookings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const getStatusStyle = (status: string): React.CSSProperties => {
        switch (status) {
            case 'CONFIRMED': return { background: 'rgba(110, 231, 183, 0.1)', color: '#6ee7b7', border: '1px solid rgba(110, 231, 183, 0.2)' };
            case 'CANCELLED': return { background: 'rgba(255, 107, 107, 0.1)', color: '#ff6b6b', border: '1px solid rgba(255, 107, 107, 0.2)' };
            default: return { background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.2)' };
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return <CheckCircle2 size={14} />;
            case 'CANCELLED': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    if (loading) return (
        <div className="min-h-screen pt-32 flex items-center justify-center" style={{ background: '#111' }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#e8d5b0' }}></div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8" style={{ background: '#111111' }}>
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <Link
                            to={APP_ROUTES.SERVICES}
                            className="inline-flex items-center text-sm mb-2 transition-colors"
                            style={{ color: '#666' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#e8d5b0')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#666')}
                        >
                            <ArrowLeft size={15} className="mr-1" />
                            Back to Services
                        </Link>
                        <h1 className="text-3xl font-black" style={{ color: '#f5ede0' }}>My Bookings</h1>
                        <p className="mt-1 text-sm" style={{ color: '#666' }}>Manage your events and reservations.</p>
                    </div>

                    <div
                        className="p-1 rounded-xl inline-flex"
                        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        {(['UPCOMING', 'PAST'] as const).map((tab, i) => (
                            <React.Fragment key={tab}>
                                {i > 0 && <div className="w-px my-1" style={{ background: 'rgba(255,255,255,0.08)' }} />}
                                <button
                                    onClick={() => setActiveTab(tab)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                    style={{
                                        background: activeTab === tab ? 'rgba(232, 213, 176, 0.12)' : 'transparent',
                                        color: activeTab === tab ? '#e8d5b0' : '#666',
                                        border: activeTab === tab ? '1px solid rgba(232, 213, 176, 0.2)' : '1px solid transparent',
                                    }}
                                >
                                    {tab === 'UPCOMING' ? `Upcoming (${upcomingBookings.length})` : `History (${pastBookings.length})`}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {displayBookings.length === 0 ? (
                    <div
                        className="rounded-2xl p-16 text-center"
                        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                            style={{ background: 'rgba(255,255,255,0.04)' }}
                        >
                            <Calendar size={28} style={{ color: '#444' }} />
                        </div>
                        <h3 className="text-lg font-bold mb-2" style={{ color: '#f5ede0' }}>No bookings found</h3>
                        <p className="text-sm mb-6" style={{ color: '#666' }}>You don't have any {activeTab.toLowerCase()} bookings.</p>
                        {activeTab === 'UPCOMING' && (
                            <Link
                                to={APP_ROUTES.SERVICES}
                                className="inline-block px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
                                style={{ background: '#e8d5b0', color: '#111111' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#f0e0c0')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#e8d5b0')}
                            >
                                Browse Services
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayBookings.map((booking) => (
                            <div
                                key={booking.id || (booking as any)._id}
                                className="rounded-2xl overflow-hidden transition-all duration-300"
                                style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.07)' }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(232, 213, 176, 0.15)')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                            >
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-56 h-44 md:h-auto relative flex-shrink-0" style={{ background: '#222' }}>
                                        {(booking.service?.images?.[0] || booking.serviceImage) ? (
                                            <img
                                                src={(booking.service?.images?.[0] || booking.serviceImage || '').startsWith('http')
                                                    ? (booking.service?.images?.[0] || booking.serviceImage)
                                                    : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1212'}${booking.service?.images?.[0] || booking.serviceImage}`}
                                                alt={booking.service?.name || booking.serviceName || 'Service'}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center" style={{ color: '#444' }}>
                                                <ImageIcon size={28} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span
                                                            className="px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center space-x-1"
                                                            style={getStatusStyle(booking.status)}
                                                        >
                                                            {getStatusIcon(booking.status)}
                                                            <span className="ml-1">{booking.status}</span>
                                                        </span>
                                                        <span className="text-xs" style={{ color: '#555' }}>
                                                            #{(booking.id || (booking as any)._id || 'N/A').slice(-6).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-bold" style={{ color: '#f5ede0' }}>
                                                        {booking.serviceName || booking.service?.name || 'Service Name Not Available'}
                                                    </h3>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-black" style={{ color: '#e8d5b0' }}>₹{booking.totalPrice}</div>
                                                    <div className="text-xs" style={{ color: '#555' }}>Total Price</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                                                <div className="flex items-center" style={{ color: '#888' }}>
                                                    <Calendar size={14} className="mr-2 flex-shrink-0" style={{ color: '#666' }} />
                                                    {new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center" style={{ color: '#888' }}>
                                                    <MapPin size={14} className="mr-2 flex-shrink-0" style={{ color: '#666' }} />
                                                    {booking.location || booking.service?.location || 'Location Not Provided'}
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className="flex flex-col sm:flex-row justify-between items-center pt-4 gap-3"
                                            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                                        >
                                            <div className="flex items-center text-xs" style={{ color: '#555' }}>
                                                <Clock size={12} className="mr-1" />
                                                Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                                            </div>

                                            <div className="flex space-x-2 w-full sm:w-auto">
                                                {booking.status === 'CONFIRMED' && !reviewedBookingIds.includes(booking.id || (booking as any)._id) && (
                                                    <button
                                                        onClick={() => setSelectedBookingForReview(booking)}
                                                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                                                        style={{
                                                            background: 'rgba(232, 213, 176, 0.1)',
                                                            color: '#e8d5b0',
                                                            border: '1px solid rgba(232, 213, 176, 0.2)',
                                                        }}
                                                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(232, 213, 176, 0.18)')}
                                                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(232, 213, 176, 0.1)')}
                                                    >
                                                        Rate & Review
                                                    </button>
                                                )}
                                                <Link
                                                    to={APP_ROUTES.BOOKING_DETAILS.replace(':id', booking.id || (booking as any)._id || '')}
                                                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-semibold text-center transition-all"
                                                    style={{ background: '#e8d5b0', color: '#111111' }}
                                                    onMouseEnter={e => (e.currentTarget.style.background = '#f0e0c0')}
                                                    onMouseLeave={e => (e.currentTarget.style.background = '#e8d5b0')}
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedBookingForReview && (
                <ReviewModal
                    bookingId={selectedBookingForReview.id || selectedBookingForReview._id}
                    serviceId={selectedBookingForReview.service?.id || selectedBookingForReview.service?._id || selectedBookingForReview.serviceId}
                    serviceName={selectedBookingForReview.serviceName || selectedBookingForReview.service?.name}
                    onClose={() => setSelectedBookingForReview(null)}
                    onSuccess={() => { fetchMyReviews(); }}
                />
            )}
        </div>
    );
}
