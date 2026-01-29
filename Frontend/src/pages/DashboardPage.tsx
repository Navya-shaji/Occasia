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
    MapPin
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
        <div className="poise-dashboard">
            {/* Sidebar */}
            <aside className="poise-sidebar">
                <div className="px-8 mb-8">
                    <h1 className="font-serif text-2xl tracking-[0.2em] text-white">OCCASIA</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`poise-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={18} />
                        <span>Overview</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('events')}
                        className={`poise-nav-btn ${activeTab === 'events' ? 'active' : ''}`}
                    >
                        <Calendar size={18} />
                        <span>My Events</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`poise-nav-btn ${activeTab === 'favorites' ? 'active' : ''}`}
                    >
                        <Heart size={18} />
                        <span>Favorites</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`poise-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
                    >
                        <Settings size={18} />
                        <span>Settings</span>
                    </button>
                </nav>

                <div className="p-8 border-t border-gray-800 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="poise-logout-btn"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="poise-main">
                <header className="poise-dashboard-header">
                    <div>
                        <h2 className="font-serif text-3xl text-black">Welcome, {user.name}</h2>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">Personal Dashboard</p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button className="text-gray-400 hover:text-black transition-colors">
                            <Bell size={20} />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                            <User size={16} className="text-gray-600" />
                        </div>
                    </div>
                </header>

                <div className="poise-content">
                    {/* Stats Row */}
                    <div className="poise-stats-grid">
                        <div className="poise-card">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-black/5 rounded-full">
                                    <Calendar className="text-black" size={20} />
                                </div>
                                <span className="poise-badge bg-green-50 text-green-600">Active</span>
                            </div>
                            <div className="text-4xl font-serif mb-1">03</div>
                            <div className="text-xs uppercase tracking-widest text-gray-400">Upcoming Events</div>
                        </div>

                        <div className="poise-card">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-black/5 rounded-full">
                                    <Heart className="text-indigo-600" size={20} />
                                </div>
                            </div>
                            <div className="text-4xl font-serif mb-1">12</div>
                            <div className="text-xs uppercase tracking-widest text-gray-400">Saved Venues</div>
                        </div>

                        <div className="poise-card">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-black/5 rounded-full">
                                    <MapPin className="text-black" size={20} />
                                </div>
                            </div>
                            <div className="text-4xl font-serif mb-1">05</div>
                            <div className="text-xs uppercase tracking-widest text-gray-400">Cities Explored</div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div>
                        <div className="flex justify-between items-end mb-8">
                            <h3 className="font-serif text-2xl">Upcoming Experiences</h3>
                            <button className="text-xs uppercase tracking-widest text-gray-500 hover:text-black border-b border-transparent hover:border-black transition-all">View All History</button>
                        </div>

                        <div className="poise-events-grid">
                            {upcomingEvents.map(event => (
                                <div key={event.id} className="poise-event-card group cursor-pointer">
                                    <div className="image-wrapper relative h-64 overflow-hidden mb-4">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="status-badge">
                                            Confirmed
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-serif text-xl mb-1 group-hover:text-indigo-600 transition-colors">{event.title}</h4>
                                            <div className="meta-row">
                                                <span className="flex items-center"><Calendar size={12} className="mr-1" /> {event.date}</span>
                                                <span className="flex items-center"><MapPin size={12} className="mr-1" /> {event.location}</span>
                                            </div>
                                        </div>
                                        <button className="action-btn">
                                            <Settings size={16} />
                                        </button>
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
