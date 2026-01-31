import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants/routes';
import authService from '../services/authService';
import {
    LayoutDashboard,
    Calendar,
    Heart,
    Settings,
    LogOut,
    Bell,
    User,
    MapPin,
    ClipboardList
} from 'lucide-react';
import eventHero from '../assets/event-hero.png';

export default function DashboardPage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [activeTab, setActiveTab] = useState('overview');

    const handleLogout = () => {
        authService.logout();
        navigate(APP_ROUTES.LOGIN);
    };

    const upcomingEvents = [
        { id: 1, title: 'The Grand Gala', date: 'Oct 24', location: 'Metropolitan Museum', image: eventHero },
        { id: 2, title: 'Tech Summit 2026', date: 'Nov 12', location: 'Silicon Valley Center', image: eventHero },
        { id: 3, title: 'Winter Wedding', date: 'Dec 05', location: 'Botanical Gardens', image: eventHero },
    ];

    return (
        <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
            {/* Sidebar - Precision Engineered */}
            <aside className="w-80 bg-slate-900 flex flex-col flex-shrink-0 animate-in slide-in-from-left duration-500">
                <div className="h-24 flex items-center px-10 border-b border-white/5">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
                            <span className="text-white font-serif text-2xl font-bold">O</span>
                        </div>
                        <span className="text-xl font-serif text-white tracking-[.4em] font-light">OCCASIA</span>
                    </div>
                </div>

                <nav className="flex-1 py-10 px-6 space-y-2">
                    {[
                        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                        { id: 'events', icon: Calendar, label: 'My Events' },
                        { id: 'favorites', icon: Heart, label: 'Curated Favorites' },
                        { id: 'settings', icon: Settings, label: 'Identity Settings' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === item.id ? 'bg-white/10 text-white shadow-lg border border-white/5' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                    <button
                        onClick={() => navigate(APP_ROUTES.MY_BOOKINGS)}
                        className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all outline-none"
                    >
                        <ClipboardList size={18} />
                        <span>Experience Manifest</span>
                    </button>
                </nav>

                <div className="p-8 space-y-4">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white border border-white/10 shadow-lg">
                                {user.name?.substring(0, 1).toUpperCase() || 'U'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-white text-sm font-bold truncate">{user.name}</p>
                                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Prestige Member</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full py-4 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 rounded-2xl transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-2"
                        >
                            <LogOut size={14} />
                            <span>Terminate Session</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Surface */}
            <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                <header className="h-24 px-12 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-20 border-b border-slate-100">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[.4em]">Personal Dashboard</p>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Salutations, {user.name?.split(' ')[0]}</h2>
                    </div>

                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-4">
                            <div className="h-10 w-[1px] bg-slate-100 mx-2" />
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Event Status</p>
                                <p className="text-sm font-bold text-slate-900">03 Scheduled</p>
                            </div>
                        </div>
                        <button className="relative w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white transition-all group shadow-sm">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                        </button>
                    </div>
                </header>

                <div className="p-12 space-y-12 animate-in fade-in duration-700">
                    {/* Key Visual Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { label: 'Upcoming Events', value: '03', icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { label: 'Curated Favorites', value: '12', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
                            { label: 'Total Experiences', value: '05', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 group hover:shadow-2xl hover:shadow-indigo-600/5 transition-all duration-500">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl shadow-sm border border-transparent group-hover:border-current transition-all duration-500`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">Live Status</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-5xl font-bold text-slate-900 group-hover:scale-110 transition-transform origin-left">{stat.value}</div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content Section - Curated Carousel/Grid */}
                    <div className="space-y-8">
                        <div className="flex justify-between items-end border-b border-slate-100 pb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Upcoming Experiences</h3>
                                <p className="text-slate-400 text-sm font-medium mt-1">Confirmed reservations for your prestige events.</p>
                            </div>
                            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors py-2 border-b-2 border-transparent hover:border-indigo-600">Archive Registry</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {upcomingEvents.map(event => (
                                <div key={event.id} className="group flex flex-col space-y-6">
                                    <div className="aspect-[4/5] relative rounded-[3rem] overflow-hidden bg-slate-100 shadow-xl shadow-black/5">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1500ms]"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        <div className="absolute top-8 left-8">
                                            <div className="px-5 py-2.5 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-white/20">
                                                Confirmed
                                            </div>
                                        </div>

                                        <div className="absolute bottom-8 left-8 right-8 space-y-2 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                                            <div className="flex items-center space-x-2 text-white/60">
                                                <MapPin size={12} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{event.location}</span>
                                            </div>
                                            <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">View Dossier</button>
                                        </div>
                                    </div>
                                    <div className="px-2 space-y-1">
                                        <h4 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{event.title}</h4>
                                        <div className="flex items-center space-x-3 text-slate-400">
                                            <Calendar size={14} className="text-indigo-400" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{event.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
