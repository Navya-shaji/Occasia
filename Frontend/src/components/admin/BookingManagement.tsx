import React, { useState, useEffect } from 'react';
import { Search, ClipboardList, CheckCircle2, XCircle, Clock, Trash2 } from 'lucide-react';
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
            setBookings(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await bookingService.updateStatus(id, status);
            toast.success(`Booking status updated to ${status}`);
            fetchBookings();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'active';
            case 'CANCELLED': return 'blocked';
            default: return 'pending';
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b._id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-gray-900">
                    <ClipboardList size={20} />
                    <h3 className="text-lg font-bold">Total Bookings: {bookings.length}</h3>
                </div>
                <div className="relative w-64">
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

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Booking ID</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </td>
                                </tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                        No bookings found.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-400">
                                            #{booking._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-semibold text-gray-900">{booking.user?.name || 'Unknown'}</div>
                                                <div className="text-xs text-gray-400">{booking.user?.email || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-semibold text-gray-900">{booking.service?.name || 'Deleted'}</div>
                                                <div className="text-xs text-gray-400">{booking.service?.category}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900">
                                            ₹{booking.totalPrice}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    booking.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-100' :
                                                        'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                {booking.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(booking._id, 'CONFIRMED')}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                            title="Confirm"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(booking._id, 'CANCELLED')}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
