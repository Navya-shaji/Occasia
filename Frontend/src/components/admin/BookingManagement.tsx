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
        <div className="space-y-8 fade-in">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                        <ClipboardList className="text-indigo-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Booking Manifest</h2>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
                            Total Registered: <span className="text-indigo-600 ml-1">{bookings.length}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-4 w-full lg:w-auto">
                    <div className="relative group flex-1 lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by User, Service or ID..."
                            className="search-input-premium w-full outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="user-table-container">
                <div className="overflow-x-auto">
                    <table className="user-table text-left">
                        <thead>
                            <tr>
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Client Detail</th>
                                <th className="px-6 py-4">Service Experience</th>
                                <th className="px-6 py-4">Timeline</th>
                                <th className="px-6 py-4">Valuation</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Synchronizing Registry...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-24 text-center">
                                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">No matching transaction records found.</div>
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black text-indigo-400 tracking-tighter">#BK-{booking._id.slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm tracking-tight">{booking.user?.name || 'Unknown'}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{booking.user?.email || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm tracking-tight">{booking.service?.name || 'Service Deleted'}</div>
                                                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">{booking.service?.category}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-[10px] font-black uppercase text-slate-500">
                                                {new Date(booking.startDate).toLocaleDateString()}
                                                <span className="mx-2 text-slate-300">→</span>
                                                {new Date(booking.endDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 text-sm">₹{booking.totalPrice}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`status-pill ${getStatusStyle(booking.status)}`}>
                                                {booking.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                {booking.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(booking._id, 'CONFIRMED')}
                                                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                                                            title="Confirm Booking"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(booking._id, 'CANCELLED')}
                                                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                            title="Reject Booking"
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
