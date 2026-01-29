import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants/routes';
import UserManagement from '../components/admin/UserManagement';
import ServiceManagement from '../components/admin/ServiceManagement';
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
        <div className="poise-dashboard admin-theme">
            {/* Sidebar - Precision Engineered */}
            <aside className="poise-sidebar">
                <div className="h-24 flex items-center px-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Shield className="text-white" size={20} />
                        </div>
                        <span className="brand-text-premium">Occasia</span>
                    </div>
                </div>

                <nav className="flex-1 py-8 space-y-1">
                    {[
                        { id: 'users', icon: Users, label: 'Users Registry' },
                        { id: 'services', icon: Package, label: 'Service Catalog' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`poise-nav-btn ${activeSection === item.id ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer-card">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                            <LogOut className="text-white/60" size={14} />
                        </div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Session Control</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 px-4 bg-white/5 hover:bg-red-500/10 text-white/70 hover:text-red-400 border border-white/10 hover:border-red-500/20 rounded-xl transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center"
                    >
                        Terminate Session
                    </button>
                </div>
            </aside>

            {/* Main Surface */}
            <main className="poise-main bg-[#f5f7fb]">
                <header className="poise-dashboard-header h-20 px-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest">
                            {activeSection === 'users' ? 'Users Registry' : 'Service Catalog'}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Search size={20} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Bell size={20} />
                        </button>
                        <div className="flex items-center space-x-4 pl-6 border-l border-gray-100">
                            <div className="text-right">
                                <div className="text-xs font-bold text-gray-900">{user.name || 'Admin'}</div>
                                <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Authority</div>
                            </div>
                            <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200">
                                {user.name?.substring(0, 2).toUpperCase() || 'AD'}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="poise-content p-10">
                    {activeSection === 'users' && <UserManagement />}
                    {activeSection === 'services' && <ServiceManagement />}
                </div>
            </main>
        </div>
    );
}
