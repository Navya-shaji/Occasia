import eventHero from '../assets/event-hero.png';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants/routes';

export default function DashboardPage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="poise-grid">
            {/* Image Section - Showing a 'Success' vibe or same background */}
            <div
                className="poise-image-section"
                style={{ backgroundImage: `url(${eventHero})` }}
            >
                <div className="poise-brand-overlay fade-in">
                    <div className="poise-brand-text">OCCASIA</div>
                    <div className="text-[10px] uppercase tracking-[0.8em] mt-2 opacity-80 text-white pl-1">
                        Premium Event Management
                    </div>
                </div>
                <div className="poise-image-overlay" style={{ background: 'rgba(0,0,0,0.4)' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 p-10 border border-black fade-in">
                        <h2 className="font-serif text-3xl tracking-widest text-black">VERIFIED</h2>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="poise-content-section">
                <div className="poise-form-container fade-in">
                    <h1 className="poise-title font-serif">Welcome Home, {user.name || 'Guest'}</h1>
                    <p className="poise-subtitle">
                        Your account has been successfully verified.
                        You are now part of the OCCASIA collective. <br /><br />
                        Begin your journey by exploring curated events or managing your personalized dashboard.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={() => navigate(APP_ROUTES.DASHBOARD)}
                            className="poise-btn btn-black"
                        >
                            Enter Dashboard
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-5 border border-black text-[10px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500"
                        >
                            Explore Collection
                        </button>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 opacity-60">
                        <p className="text-[9px] uppercase tracking-[0.2em] leading-loose">
                            OCCASIA © 2026 <br />
                            A NEW STANDARD IN EVENT MANAGEMENT
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
