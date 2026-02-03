import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingService, { Booking } from '../services/bookingService';
import {
    Calendar,
    MapPin,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    Phone,
    Mail,
    Image as ImageIcon
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

    if (!booking) return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(APP_ROUTES.MY_BOOKINGS)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors mb-6"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back to My Bookings</span>
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Image */}
                    <div className="h-64 relative bg-gray-200">
                        {booking.service?.images?.[0] ? (
                            <img
                                src={booking.service.images[0].startsWith('http') ? booking.service.images[0] : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1212'}${booking.service.images[0]}`}
                                alt={booking.service.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon size={64} />
                            </div>
                        )}
                        <div className="absolute top-4 left-4">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold border flex items-center space-x-2 shadow-lg ${getStatusStyle(booking.status)} bg-white/95 backdrop-blur-sm`}>
                                {getStatusIcon(booking.status)}
                                <span>{booking.status}</span>
                            </span>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Title Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{booking.service?.name}</h1>
                                <div className="flex items-center text-gray-500">
                                    <MapPin size={18} className="mr-2 text-gray-400" />
                                    {booking.service?.location}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total Booking Amount</p>
                                <p className="text-3xl font-bold text-blue-600">₹{booking.totalPrice}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Booking Details */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Booking Information</h3>

                                <div className="flex items-start">
                                    <div className="bg-blue-50 p-3 rounded-lg mr-4">
                                        <Calendar className="text-blue-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Dates</p>
                                        <p className="font-semibold text-gray-900">
                                            {new Date(booking.startDate).toDateString()} - {new Date(booking.endDate).toDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-purple-50 p-3 rounded-lg mr-4">
                                        <Clock className="text-purple-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Booking Reference</p>
                                        <p className="font-mono font-semibold text-gray-900 tracking-wider">#{booking._id.slice(-8).toUpperCase()}</p>
                                        <p className="text-xs text-gray-400 mt-1">Booked on {new Date(booking.bookingDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Vendor Contact */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Vendor Contact</h3>

                                <div className="bg-gray-50 p-5 rounded-xl space-y-4">
                                    <div className="flex items-center">
                                        <Phone size={18} className="mr-3 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Phone</p>
                                            <p className="font-medium">{booking.service?.contactDetails?.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail size={18} className="mr-3 text-gray-400" />
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="font-medium">{booking.service?.contactDetails?.email || 'N/A'}</p>
                                        </div>
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
