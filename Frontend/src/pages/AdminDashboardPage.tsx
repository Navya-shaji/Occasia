import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants/routes';
import adminService, { User } from '../services/adminService';
import toast from 'react-hot-toast';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    LogOut,
    Shield,
    DollarSign,
    MoreVertical,
    Lock,
    Unlock
} from 'lucide-react';

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const limit = 10;

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (activeSection === 'users') {
            fetchUsers(currentPage);
        }
    }, [activeSection, currentPage]);

    const fetchUsers = async (page: number) => {
        setLoading(true);
        try {
            const response = await adminService.getAllUsers(page, limit);
            setUsers(response.data);
            setTotalUsers(response.total);
            setTotalPages(Math.ceil(response.total / limit));
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async (user: User) => {
        try {
            if (user.isBlocked) {
                await adminService.unblockUser(user._id);
                toast.success(`Unblocked ${user.name}`);
            } else {
                await adminService.blockUser(user._id);
                toast.success(`Blocked ${user.name}`);
            }
            fetchUsers(currentPage);
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate(APP_ROUTES.LOGIN);
    };

    return (
        <div className="poise-dashboard admin-theme">
            {/* Admin Sidebar */}
            <aside className="poise-sidebar">
                <div className="h-20 flex items-center px-8 border-b border-gray-800">
                    <div className="bg-white text-black p-1 mr-3">
                        <Shield size={20} />
                    </div>
                    <span className="font-serif text-xl tracking-widest text-white">ADMIN</span>
                </div>

                <nav className="flex-1 py-8 space-y-1">
                    {[
                        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                        { id: 'users', icon: Users, label: 'User Management' },
                        { id: 'events', icon: Calendar, label: 'Events' },
                        { id: 'finance', icon: DollarSign, label: 'Finance' },
                        { id: 'settings', icon: Settings, label: 'Settings' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveSection(item.id);
                                setCurrentPage(1);
                            }}
                            className={`poise-nav-btn ${activeSection === item.id ? 'active' : ''}`}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors text-xs uppercase tracking-widest"
                    >
                        <LogOut size={18} />
                        <span className="ml-3">System Logout</span>
                    </button>
                </div>
            </aside>

            {/* Admin Content */}
            <main className="poise-main">
                <header className="poise-dashboard-header">
                    <div>
                        <h2 className="font-serif text-2xl">{activeSection === 'overview' ? 'Dashboard Overview' : 'User Management'}</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <div className="text-xs font-bold uppercase tracking-widest">{user.name || 'Administrator'}</div>
                            <div className="text-[10px] text-gray-400">Super User Access</div>
                        </div>
                        <div className="h-10 w-10 bg-black text-white flex items-center justify-center rounded-full text-xs font-serif">
                            AD
                        </div>
                    </div>
                </header>

                <div className="poise-content space-y-8">

                    {activeSection === 'overview' && (
                        <>
                            {/* KPI Cards */}
                            <div className="poise-stats-grid">
                                {[
                                    { label: 'Total Revenue', value: '$124,500', icon: DollarSign, trend: '+12.5%' },
                                    { label: 'Active Users', value: '1,240', icon: Users, trend: '+3.2%' },
                                    { label: 'Pending Approvals', value: '45', icon: Shield, trend: '-5%' },
                                    { label: 'Events Hosted', value: '892', icon: Calendar, trend: '+28%' },
                                ].map((stat, i) => (
                                    <div key={i} className="poise-card group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400">{stat.label}</div>
                                            <stat.icon size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                                        </div>
                                        <div className="flex items-baseline space-x-2">
                                            <div className="text-3xl font-serif">{stat.value}</div>
                                            <div className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                                {stat.trend}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Main Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white border border-gray-200 p-8 text-center text-gray-400 text-sm">
                                    <h3 className="font-serif text-xl text-black mb-4">System Overview</h3>
                                    Chart Placeholder - Select 'User Management' for actions.
                                </div>

                                {/* System Log */}
                                <div className="poise-system-card">
                                    <div>
                                        <h3 className="font-serif text-xl mb-6">System Health</h3>
                                        <div className="space-y-6">
                                            <div className="health-bar">
                                                <div className="label">
                                                    <span>Server Load</span>
                                                    <span>24%</span>
                                                </div>
                                                <div className="bar-bg">
                                                    <div className="bar-fill green" style={{ width: '25%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeSection === 'users' && (
                        <div className="bg-white border border-gray-200 shadow-sm">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                                <h3 className="font-serif text-xl">Registered Users</h3>
                                <div className="text-xs uppercase tracking-widest text-gray-400">Total: {totalUsers}</div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="poise-table w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th>User</th>
                                            <th>Role</th>
                                            <th>Verified</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {loading ? (
                                            <tr><td colSpan={5} className="p-12 text-center text-sm">
                                                <div className="flex flex-col items-center space-y-4">
                                                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="uppercase tracking-widest text-xs font-semibold">Updating Directory...</span>
                                                </div>
                                            </td></tr>
                                        ) : users.length === 0 ? (
                                            <tr><td colSpan={5} className="p-12 text-center text-gray-400 uppercase tracking-widest text-xs font-semibold">No users found</td></tr>
                                        ) : users.map((u) => (
                                            <tr key={u._id} className="hover:bg-gray-50/80 transition-all duration-300">
                                                <td className="p-4">
                                                    <div className="font-bold text-sm tracking-tight">{u.name}</div>
                                                    <div className="text-xs text-gray-400">{u.email}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 text-[9px] uppercase tracking-wider font-bold rounded-sm ${u.role === 'ADMIN' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`status-indicator ${u.isVerified ? 'verified' : 'pending'}`}>
                                                        {u.isVerified ? 'Verified' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`status-indicator ${u.isBlocked ? 'suspended' : 'verified'}`}>
                                                        {u.isBlocked ? 'Blocked' : 'Active'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => handleToggleBlock(u)}
                                                        className={`flex items-center space-x-2 text-[10px] uppercase font-bold tracking-wider px-4 py-2 border transition-all duration-300 ${u.isBlocked ? 'border-green-500 text-green-600 hover:bg-green-500 hover:text-white' : 'border-red-200 text-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white'}`}
                                                    >
                                                        {u.isBlocked ? <Unlock size={12} /> : <Lock size={12} />}
                                                        <span>{u.isBlocked ? 'Unblock' : 'Block Access'}</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                                <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1 || loading}
                                        className="px-4 py-2 border border-gray-200 text-[10px] uppercase tracking-widest font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-all duration-300"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages || loading}
                                        className="px-4 py-2 border border-gray-200 text-[10px] uppercase tracking-widest font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-all duration-300"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
