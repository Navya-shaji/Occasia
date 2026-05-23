import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { APP_ROUTES } from '../constants/routes';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();

    const isLanding = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        setIsOpen(false);
    };

    const navBg = scrolled || !isLanding
        ? 'border-b'
        : 'border-b border-transparent';

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${navBg}`}
            style={{
                background: scrolled || !isLanding ? 'rgba(17,17,17,0.95)' : 'transparent',
                backdropFilter: scrolled || !isLanding ? 'blur(20px)' : 'none',
                borderColor: scrolled || !isLanding ? 'rgba(255,255,255,0.08)' : 'transparent',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center">
                        <span className="font-serif text-2xl font-black tracking-widest" style={{ color: '#e8d5b0' }}>
                            OCCASIA
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-sm font-medium transition-colors"
                            style={{ color: '#c9b99a' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#e8d5b0')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#c9b99a')}
                        >
                            Home
                        </Link>
                        <Link
                            to={APP_ROUTES.SERVICES}
                            className="text-sm font-medium transition-colors"
                            style={{ color: '#c9b99a' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#e8d5b0')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#c9b99a')}
                        >
                            Services
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to={APP_ROUTES.MY_BOOKINGS}
                                    className="text-sm font-medium transition-colors"
                                    style={{ color: '#c9b99a' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#e8d5b0')}
                                    onMouseLeave={e => (e.currentTarget.style.color = '#c9b99a')}
                                >
                                    My Bookings
                                </Link>
                                <Link
                                    to={APP_ROUTES.WISHLIST}
                                    className="text-sm font-medium transition-colors flex items-center"
                                    style={{ color: '#c9b99a' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#e8d5b0')}
                                    onMouseLeave={e => (e.currentTarget.style.color = '#c9b99a')}
                                >
                                    <Heart size={16} className="mr-1" />
                                    Wishlist
                                </Link>
                                <div className="h-4 w-px" style={{ background: 'rgba(255,255,255,0.15)' }}></div>
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                                        style={{ background: '#e8d5b0', color: '#111' }}
                                    >
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="text-sm font-medium" style={{ color: '#c9b99a' }}>{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium transition-colors"
                                    style={{ color: '#ff6b6b' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#ff4444')}
                                    onMouseLeave={e => (e.currentTarget.style.color = '#ff6b6b')}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to={APP_ROUTES.LOGIN}
                                    className="text-sm font-medium transition-colors"
                                    style={{ color: '#c9b99a' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#e8d5b0')}
                                    onMouseLeave={e => (e.currentTarget.style.color = '#c9b99a')}
                                >
                                    Log In
                                </Link>
                                <Link
                                    to={APP_ROUTES.REGISTER}
                                    className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
                                    style={{ background: '#e8d5b0', color: '#111111' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = '#f0e0c0')}
                                    onMouseLeave={e => (e.currentTarget.style.background = '#e8d5b0')}
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="transition-colors"
                            style={{ color: '#c9b99a' }}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div
                    className="md:hidden absolute w-full border-t"
                    style={{
                        background: 'rgba(17,17,17,0.98)',
                        backdropFilter: 'blur(20px)',
                        borderColor: 'rgba(255,255,255,0.08)',
                    }}
                >
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <Link
                            to="/"
                            className="block px-3 py-3 rounded-xl text-base font-medium transition-colors"
                            style={{ color: '#c9b99a' }}
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to={APP_ROUTES.SERVICES}
                            className="block px-3 py-3 rounded-xl text-base font-medium transition-colors"
                            style={{ color: '#c9b99a' }}
                            onClick={() => setIsOpen(false)}
                        >
                            Services
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={APP_ROUTES.MY_BOOKINGS}
                                    className="block px-3 py-3 rounded-xl text-base font-medium"
                                    style={{ color: '#c9b99a' }}
                                    onClick={() => setIsOpen(false)}
                                >
                                    My Bookings
                                </Link>
                                <Link
                                    to={APP_ROUTES.WISHLIST}
                                    className="block px-3 py-3 rounded-xl text-base font-medium"
                                    style={{ color: '#c9b99a' }}
                                    onClick={() => setIsOpen(false)}
                                >
                                    Wishlist
                                </Link>
                                <div className="border-t my-2 pt-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                                    <div className="flex items-center px-3 py-2">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mr-3"
                                            style={{ background: '#e8d5b0', color: '#111' }}
                                        >
                                            {user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="text-sm font-medium" style={{ color: '#c9b99a' }}>{user?.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-base font-medium rounded-xl"
                                        style={{ color: '#ff6b6b' }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                                <Link
                                    to={APP_ROUTES.LOGIN}
                                    className="block px-3 py-3 rounded-xl text-base font-medium"
                                    style={{ color: '#c9b99a' }}
                                    onClick={() => setIsOpen(false)}
                                >
                                    Log In
                                </Link>
                                <Link
                                    to={APP_ROUTES.REGISTER}
                                    className="block px-3 py-3 rounded-xl text-base font-semibold text-center mx-3"
                                    style={{ background: '#e8d5b0', color: '#111111' }}
                                    onClick={() => setIsOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
