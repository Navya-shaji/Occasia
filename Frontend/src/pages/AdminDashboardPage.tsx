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
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        authService.logout();
        navigate(APP_ROUTES.LOGIN);
    };

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
            {/* Sidebar - Command Center */}
            <aside className="w-80 bg-slate-900 flex flex-col flex-shrink-0 animate-in slide-in-from-left duration-500">
                <div className="h-24 flex items-center px-10 border-b border-white/5">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg shadow-indigo-500/20">
                            <Shield className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-serif text-white tracking-[.4em] font-light italic">OCCASIA</span>
                    </div>
                </div>

                <nav className="flex-1 py-10 px-6 space-y-2">
                    {[
                        { id: 'users', icon: Users, label: 'Subject Registry' },
                        { id: 'services', icon: Package, label: 'Service Catalog' },
                        { id: 'bookings', icon: ClipboardList, label: 'Booking Manifest' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeSection === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-8 space-y-4">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
                        <div className="flex items-center space-x-3 text-white/40">
                            <Activity size={14} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Authority Console</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full py-4 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 rounded-2xl transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2"
                        >
                            <LogOut size={14} />
                            <span>Terminate Access</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Operational Surface */}
            <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                <header className="h-24 px-12 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl z-20 border-b border-slate-100">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[.4em]">Administrative Oversight</p>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-none uppercase">
                            {activeSection === 'users' ? 'Subject Registry' : activeSection === 'services' ? 'Service Catalog' : 'Booking Manifest'}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-8">
                        <div className="hidden lg:flex items-center space-x-6">
                            <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100">
                                <Search size={18} />
                            </button>
                            <div className="h-8 w-[1px] bg-slate-100" />
                        </div>

                        <div className="flex items-center space-x-4 pl-4 border-l border-slate-100">
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-900">{user.name || 'Admin'}</div>
                                <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest opacity-60">Master Authority</div>
                            </div>
                            <div className="h-12 w-12 bg-gradient-to-tr from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center text-xs font-black text-slate-700 border border-white shadow-sm">
                                {user.name?.substring(0, 2).toUpperCase() || 'AD'}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-12 animate-in fade-in duration-700">
                    {activeSection === 'users' && <UserManagement />}
                    {activeSection === 'services' && <ServiceManagement />}
                    {activeSection === 'bookings' && <BookingManagement />}
                </div>
            </main>
        </div>
    );
}
