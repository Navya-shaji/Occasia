import eventHero from '../assets/event-hero.png';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants/routes';

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate(APP_ROUTES.LOGIN);
    };

    return (
        <div className="poise-grid">
            <div className="poise-image-section" style={{ backgroundImage: `url(${eventHero})` }}>
                <div className="poise-brand-overlay fade-in">
                    <div className="poise-brand-text">OCCASIA</div>
                    <div className="text-[10px] uppercase tracking-[0.8em] mt-2 opacity-80 text-white pl-1">
                        Admin Portal
                    </div>
                </div>
                <div className="poise-image-overlay" style={{ background: 'rgba(0,0,0,0.6)' }} />
            </div>

            <div className="poise-content-section bg-white">
                <div className="poise-form-container fade-in">
                    <h1 className="poise-title font-serif">Admin Dashboard</h1>
                    <p className="poise-subtitle">
                        Welcome back, {user.name || 'Admin'}. <br />
                        System status: <span className="text-green-600 font-bold">OPERATIONAL</span>
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white p-6 border border-gray-200 text-center hover:border-black transition-colors cursor-pointer">
                            <div className="text-3xl font-serif mb-2">124</div>
                            <div className="text-[10px] uppercase tracking-widest text-gray-500">Active Users</div>
                        </div>
                        <div className="bg-white p-6 border border-gray-200 text-center hover:border-black transition-colors cursor-pointer">
                            <div className="text-3xl font-serif mb-2">45</div>
                            <div className="text-[10px] uppercase tracking-widest text-gray-500">Events</div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="poise-btn"
                    >
                        Secure Logout
                    </button>

                    <div className="poise-footer-link mt-8">
                        <button onClick={() => navigate(APP_ROUTES.DASHBOARD)} className="poise-link">
                            View User Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
