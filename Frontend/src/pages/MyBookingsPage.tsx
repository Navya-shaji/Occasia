import React, { useState, useEffect } from 'react';
import bookingService, { Booking } from '../services/bookingService';
import {
    Calendar,
    MapPin,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Image as ImageIcon
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { APP_ROUTES } from '../constants/routes';
import toast from 'react-hot-toast';

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await bookingService.getMyBookings();
            // Sort by date: upcoming first, then past
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
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await bookingService.cancelBooking(id);
            toast.success('Booking cancelled successfully');
            fetchBookings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-50 text-green-700 border-green-100';
            case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-yellow-50 text-yellow-700 border-yellow-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return <CheckCircle2 size={16} />;
            case 'CANCELLED': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    if (loading) return (
        <div className="min-h-screen pt-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <Link
                            to={APP_ROUTES.SERVICES}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-2 transition-colors"
                        >
                            <ArrowLeft size={16} className="mr-1" />
                            Back to Services
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                        <p className="text-gray-500 mt-1">Manage your events and reservations.</p>
                    </div>

                    <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-100 inline-flex">
                        <button
                            onClick={() => setActiveTab('UPCOMING')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'UPCOMING'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Upcoming ({upcomingBookings.length})
                        </button>
                        <div className="w-px bg-gray-200 my-2 mx-1"></div>
                        <button
                            onClick={() => setActiveTab('PAST')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'PAST'
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            History ({pastBookings.length})
                        </button>
                    </div>
                </div>

                {displayBookings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                        <p className="text-gray-500 mb-6">You don't have any {activeTab.toLowerCase()} bookings.</p>
                        {activeTab === 'UPCOMING' && (
                            <Link
                                to={APP_ROUTES.SERVICES}
                                className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Browse Services
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {displayBookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-64 h-48 md:h-auto relative bg-gray-100">
                                        {booking.service?.images?.[0] ? (
                                            <img
                                                src={booking.service.images[0].startsWith('http') ? booking.service.images[0] : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1212'}${booking.service.images[0]}`}
                                                alt={booking.service?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <ImageIcon size={32} />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-800">
                                            {booking.service?.category}
                                        </div>
                                    </div>

                                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                                        <div>
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusStyle(booking.status)}`}>
                                                            {getStatusIcon(booking.status)}
                                                            <span>{booking.status}</span>
                                                        </span>
                                                        <span className="text-xs text-gray-400">#{booking._id.slice(-6).toUpperCase()}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900">{booking.service?.name}</h3>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-blue-600">₹{booking.totalPrice}</div>
                                                    <div className="text-xs text-gray-500">Total Price</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                                                <div className="flex items-center">
                                                    <Calendar size={16} className="mr-2 text-gray-400" />
                                                    <span className="font-medium text-gray-900 mr-2">Dates:</span>
                                                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPin size={16} className="mr-2 text-gray-400" />
                                                    <span className="font-medium text-gray-900 mr-2">Location:</span>
                                                    {booking.service?.location}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-100 gap-4">
                                            <div className="text-xs text-gray-500 flex items-center">
                                                <Clock size={14} className="mr-1" />
                                                Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                                            </div>

                                            <div className="flex space-x-3 w-full sm:w-auto">
                                                {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && activeTab === 'UPCOMING' && (
                                                    <button
                                                        onClick={() => handleCancel(booking._id)}
                                                        className="flex-1 sm:flex-none px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                                <Link
                                                    to={APP_ROUTES.BOOKING_DETAILS.replace(':id', booking._id)}
                                                    className="flex-1 sm:flex-none px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors text-center"
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
        </div>
    );
}
