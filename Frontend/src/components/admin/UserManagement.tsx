import React, { useState, useEffect } from 'react';
import { Search, Lock, Unlock, Users } from 'lucide-react';
import adminService, { User } from '../../services/adminService';
import toast from 'react-hot-toast';

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
    const limit = 10;

    useEffect(() => {
        fetchUsers(currentPage, searchQuery, statusFilter);
    }, [currentPage, searchQuery, statusFilter]);

    const fetchUsers = async (page: number, search: string, status: string) => {
        setLoading(true);
        try {
            const response = await adminService.getAllUsers(page, limit, search, status);
            setUsers(Array.isArray(response.data) ? response.data : []);
            setTotalUsers(response.total || 0);
            setTotalPages(Math.ceil((response.total || 0) / limit));
        } catch (error) {
            console.error('Fetch users error:', error);
            toast.error('Failed to update directory');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async (u: User) => {
        try {
            if (u.isBlocked) {
                await adminService.unblockUser(u._id);
                toast.success(`Access restored for ${u.name}`);
            } else {
                await adminService.blockUser(u._id);
                toast.success(`Access restricted for ${u.name}`);
            }
            fetchUsers(currentPage, searchQuery, statusFilter);
        } catch (error) {
            toast.error('Action failure');
        }
    };

    return (
        <div className="space-y-8 fade-in">
            {/* Header Section - Premium Controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
                        <Users className="text-indigo-600" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Identity Registry</h2>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
                            Total Registered Subjects: <span className="text-indigo-600 ml-1">{totalUsers}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-4 w-full lg:w-auto">
                    <div className="relative group flex-1 lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find identity in manifest..."
                            className="search-input-premium w-full outline-none"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Table Container - Luxury Presentation */}
            <div className="user-table-container">
                <div className="overflow-x-auto">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th className="w-20 text-center">Manifest #</th>
                                <th>Subject Detail</th>
                                <th>Registry Email</th>
                                <th>Status</th>
                                <th>Registry Date</th>
                                <th className="text-center">Authentication control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Synchronizing Registry...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-24 text-center">
                                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">No subjects found in current manifest criteria.</div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((u, index) => (
                                    <tr key={u._id}>
                                        <td className="text-center font-bold text-slate-300 text-xs">
                                            {String(((currentPage - 1) * limit) + index + 1).padStart(3, '0')}
                                        </td>
                                        <td>
                                            <div className="flex items-center space-x-4">
                                                <div className="user-avatar-circle">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm tracking-tight">{u.name}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verified Member</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-slate-500 font-medium text-sm">{u.email}</td>
                                        <td>
                                            <div className={`status-pill ${u.isBlocked ? 'blocked' : 'active'}`}>
                                                {u.isBlocked ? 'Restricted' : 'Operational'}
                                            </div>
                                        </td>
                                        <td className="text-slate-400 text-xs font-bold">
                                            {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="text-center">
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={!u.isBlocked}
                                                    onChange={() => handleToggleBlock(u)}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Registry Pagination Controls */}
                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Secure Connection</span>
                    </div>
                    <div className="flex space-x-3">
                        <button
                            disabled={currentPage === 1 || loading}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-6 py-2.5 text-[10px] font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 transition-all flex items-center uppercase tracking-widest"
                        >
                            Prior
                        </button>
                        <button
                            disabled={currentPage === totalPages || loading}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-6 py-2.5 text-[10px] font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-all shadow-sm shadow-indigo-200 uppercase tracking-widest"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
