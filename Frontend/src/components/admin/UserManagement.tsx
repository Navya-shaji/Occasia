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
            toast.error('Failed to load users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async (u: User) => {
        const userId = u.id || (u as any)._id;
        if (!userId) return;

        try {
            if (u.isBlocked) {
                await adminService.unblockUser(userId);
                toast.success(`User unblocked`);
            } else {
                await adminService.blockUser(userId);
                toast.success(`User blocked`);
            }
            fetchUsers(currentPage, searchQuery, statusFilter);
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-sm text-gray-500">Total Users: {totalUsers}</p>
                </div>
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No users found.</td>
                                </tr>
                            ) : (
                                users.map((u) => {
                                    const uId = u.id || (u as any)._id || '';
                                    return (
                                        <tr key={uId} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                                                        {u.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{u.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-mono">ID: {uId.slice(-8).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-md text-[11px] font-semibold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                        u.role === 'VENDOR' ? 'bg-indigo-100 text-indigo-700' :
                                                            'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${u.isBlocked ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${u.isBlocked ? 'bg-red-500' : 'bg-green-500'}`} />
                                                    {u.isBlocked ? 'Blocked' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleToggleBlock(u)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${u.isBlocked
                                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                        }`}
                                                >
                                                    {u.isBlocked ? 'Unblock' : 'Block'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">Page {currentPage} of {totalPages}</span>
                    <div className="flex space-x-2">
                        <button
                            disabled={currentPage === 1 || loading}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            disabled={currentPage === totalPages || loading}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
