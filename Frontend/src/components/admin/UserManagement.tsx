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
        const userId = u.id || (u as any)._id; // Fallback to _id if id is missing

        if (!userId) {
            toast.error('User ID invalid');
            return;
        }

        try {
            if (u.isBlocked) {
                await adminService.unblockUser(userId);
                toast.success(`Access restored for ${u.name}`);
            } else {
                await adminService.blockUser(userId);
                toast.success(`Access restricted for ${u.name}`);
            }
            fetchUsers(currentPage, searchQuery, statusFilter);
        } catch (error) {
            toast.error('Action failure');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">User Management</h3>
                    <p className="text-3xl font-black text-slate-900">Total Users: <span className="text-blue-600 font-mono">{totalUsers}</span></p>
                </div>
                <div className="relative w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID, Name or Email..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5">Name</th>
                                <th className="px-8 py-4">Email</th>
                                <th className="px-8 py-4">Role</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center">
                                        <div className="inline-flex items-center space-x-3">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center text-slate-400 italic">
                                        Zero subjects detected in current scope.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id || (u as any)._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-50 to-indigo-50 text-blue-600 border border-blue-100 flex items-center justify-center font-black text-sm">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-900 block">{u.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase italic">ID: {(u.id || (u as any)._id || 'N/A').slice(-8)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-medium text-slate-600">{u.email}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-widest border ${u.role === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                u.role === 'VENDOR' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${u.isBlocked ? 'text-rose-500' : 'text-emerald-500'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${u.isBlocked ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                                {u.isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-center">
                                            <button
                                                onClick={() => handleToggleBlock(u)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest shadow-sm transition-all duration-300 ${u.isBlocked
                                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-200'
                                                    : 'bg-rose-600 text-white hover:bg-rose-700 hover:shadow-rose-200'
                                                    }`}
                                            >
                                                {u.isBlocked ? 'Unblock' : 'Block'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Page Scope {currentPage} / {totalPages}</span>
                    <div className="flex space-x-3">
                        <button
                            disabled={currentPage === 1 || loading}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm"
                        >
                            Retract
                        </button>
                        <button
                            disabled={currentPage === totalPages || loading}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 border border-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-30 disabled:hover:bg-blue-600 transition-all shadow-md shadow-blue-200"
                        >
                            Advance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
