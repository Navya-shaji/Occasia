import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import bookingService, { Booking } from '../../services/bookingService';
import toast from 'react-hot-toast';

export default function BookingManagement() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await bookingService.getAllBookings();
            const data = Array.isArray(response.data) ? response.data : [];
            console.log('Admin Bookings Data:', data);
            setBookings(data);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (e: React.MouseEvent, id: string, status: string) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistically update or just fetch silently to prevent "reload" flicker
        try {
            await bookingService.updateStatus(id, status);
            toast.success(`Booking ${status.toLowerCase()}`);

            // Silent refresh of data
            const response = await bookingService.getAllBookings();
            setBookings(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const filteredBookings = bookings.filter(b => {
        const userName = b.user?.name || b.userName || 'Anonymous';
        const bookingId = b.id || (b as any)._id || b.serviceId || '';

        return (
            userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bookingId.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
                    <p className="text-sm text-gray-500">Total Bookings: {bookings.length}</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search bookings..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Booking ID</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        Loading bookings...
                                    </td>
                                </tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        No bookings found.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => {
                                    const bId = booking.id || (booking as any)._id || '';
                                    return (
                                        <tr key={bId} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs text-gray-500">
                                                    #{bId ? bId.slice(-8).toUpperCase() : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 font-medium">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{booking.user?.name || booking.userName || 'Anonymous'}</span>
                                                    <span className="text-xs text-gray-500">{booking.user?.email || booking.userEmail || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                <div className="text-xs">
                                                    <div>{formatDate(booking.startDate)}</div>
                                                    <div className="text-gray-400">to {formatDate(booking.endDate)}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                ₹{(booking.totalPrice || 0).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 rounded-md text-[11px] font-semibold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center space-x-2">
                                                    {booking.status === 'PENDING' && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleUpdateStatus(e, bId, 'CONFIRMED')}
                                                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                            title="Confirm"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                    )}
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
        </div>
    );
}
