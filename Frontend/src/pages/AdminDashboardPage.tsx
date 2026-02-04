import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants/routes';
import UserManagement from '../components/admin/UserManagement';
import ServiceManagement from '../components/admin/ServiceManagement';
import BookingManagement from '../components/admin/BookingManagement';
import authService from '../services/authService';
import {
    LayoutDashboard,
    Users,
    Store,
    MapPin,
    FileText,
    ClipboardList,
    Grid,
    Image as ImageIcon,
    CreditCard,
    Wallet,
    LogOut,
    Shield,
    DollarSign,
    Activity,
    UserPlus,
    Bell,
    Search,
    Package
} from 'lucide-react';

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('users');

    // Safety check for user JSON parsing
    const getUserFromStorage = () => {
        try {
            const stored = localStorage.getItem('user');
            if (!stored || stored === 'undefined') return {};
            return JSON.parse(stored);
        } catch (e) {
            console.error("Failed to parse user from storage", e);
            return {};
        }
    };

    const user = getUserFromStorage();

    const handleLogout = () => {
        authService.logout();
        navigate(APP_ROUTES.LOGIN);
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
            {/* Sidebar - Modern & Deep */}
            <aside className="w-72 bg-[#0F172A] flex flex-col flex-shrink-0 relative overflow-hidden">
                {/* Decorative radial gradient for depth */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />

                <div className="h-24 flex items-center px-10 relative z-10">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Shield className="text-white" size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-white tracking-tight leading-none">OCCASIA</span>
                            <span className="text-[10px] text-blue-400 font-bold tracking-[0.2em] mt-1 uppercase">Control Center</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 py-8 px-6 space-y-1 relative z-10">
                    <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Core Management</p>
                    {[
                        { id: 'users', icon: Users, label: 'Subject Registry' },
                        { id: 'services', icon: Package, label: 'Service Catalog' },
                        { id: 'bookings', icon: ClipboardList, label: 'Booking Manifest' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${activeSection === item.id
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={18} className={activeSection === item.id ? 'text-white' : 'text-gray-500 group-hover:text-white'} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-6 relative z-10">
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                                {user.name?.substring(0, 1) || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user.name || 'Admin Authority'}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Level 3 Clearance</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:border-transparent transition-all duration-300"
                        >
                            <LogOut size={14} />
                            <span>Terminate Session</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative">
                <header className="h-24 px-12 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100">
                    <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-1">Administrative Oversight</p>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                            {activeSection === 'users' ? 'Subject Registry' : activeSection === 'services' ? 'Service Catalog' : 'Booking Manifest'}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" size={18} />
                            <input
                                type="text"
                                placeholder="Universal Search..."
                                className="bg-slate-100 border-none rounded-full pl-10 pr-4 py-2.5 text-sm w-64 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            />
                        </div>
                        <button className="relative p-2.5 bg-slate-100 rounded-full text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="p-12 max-w-[1600px]">
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeSection === 'users' && <UserManagement />}
                        {activeSection === 'services' && <ServiceManagement />}
                        {activeSection === 'bookings' && <BookingManagement />}
                    </div>
                </div>
            </main>
        </div>
    );
}
