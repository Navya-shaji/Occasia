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

    const getUserFromStorage = () => {
        try {
            const stored = localStorage.getItem('user');
            if (!stored || stored === 'undefined') return {};
            return JSON.parse(stored);
        } catch (e) {
            return {};
        }
    };

    const user = getUserFromStorage();

    const handleLogout = () => {
        authService.logout();
        navigate(APP_ROUTES.LOGIN);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
                <div className="h-20 flex items-center px-6 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Shield className="text-white" size={18} />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">Occasia Admin</span>
                    </div>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-1">
                    {[
                        { id: 'users', icon: Users, label: 'Users' },
                        { id: 'services', icon: Package, label: 'Services' },
                        { id: 'bookings', icon: ClipboardList, label: 'Bookings' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === item.id
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs border border-gray-200">
                            {user.name?.substring(0, 1) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name || 'Administrator'}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Admin Account</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-auto">
                <header className="h-20 px-8 flex items-center justify-between bg-white border-b border-gray-200 sticky top-0 z-20">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {activeSection === 'users' ? 'User Management' : activeSection === 'services' ? 'Service Management' : 'Booking Management'}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Bell size={20} />
                        </button>
                    </div>
                </header>

                <div className="p-8">
                    <div className="max-w-6xl mx-auto">
                        {activeSection === 'users' && <UserManagement />}
                        {activeSection === 'services' && <ServiceManagement />}
                        {activeSection === 'bookings' && <BookingManagement />}
                    </div>
                </div>
            </main>
        </div>
    );
}
