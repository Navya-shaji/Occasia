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
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Booking Manifest</h3>
                    <p className="text-3xl font-black text-slate-900">Total Registered: <span className="text-blue-600 font-mono">{bookings.length}</span></p>
                </div>
                <div className="relative w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by User, Service or ID..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5">Transaction ID</th>
                                <th className="px-8 py-5">Client Detail</th>
                                <th className="px-8 py-5">Service Experience</th>
                                <th className="px-8 py-5">Timeline</th>
                                <th className="px-8 py-5">Valuation</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-24 text-center">
                                        <div className="inline-flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3 opacity-20">
                                            <ClipboardList size={48} />
                                            <p className="font-bold uppercase tracking-widest text-xs">No matching transaction records found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                                #{booking._id.slice(-8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-100 to-slate-50 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200 shadow-sm">
                                                    {(booking.user?.name || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{booking.user?.name || 'Anonymous User'}</div>
                                                    <div className="text-[10px] text-slate-400 font-medium">{booking.user?.email || 'unreachable@identity.io'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div>
                                                <div className="font-bold text-slate-900">{booking.service?.name || 'Archived Service'}</div>
                                                <div className="text-[10px] text-blue-600 font-bold tracking-wider uppercase">{booking.service?.category}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col text-[11px] font-bold text-slate-600">
                                                <span>S: {new Date(booking.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                <span className="text-slate-300">E: {new Date(booking.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-black text-slate-900">
                                            ₹{booking.totalPrice.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest border shadow-sm ${booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    booking.status === 'CANCELLED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                        'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center space-x-2">
                                                {booking.status === 'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(booking._id, 'CONFIRMED')}
                                                            className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all shadow-sm"
                                                            title="Authorize"
                                                        >
                                                            <CheckCircle2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(booking._id, 'CANCELLED')}
                                                            className="w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition-all shadow-sm"
                                                            title="Revoke"
                                                        >
                                                            <XCircle size={16} />
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
