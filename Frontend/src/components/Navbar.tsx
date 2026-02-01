import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { APP_ROUTES } from '../constants/routes';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();

    // Check if we are on a transparent header page (like landing)
    const isLanding = location.pathname === '/';

    const handleLogout = () => {
        dispatch(logout());
        setIsOpen(false);
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isLanding ? 'bg-transparent' : 'bg-white shadow-sm border-b border-gray-100'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center">
                        <span className={`font-serif text-2xl font-bold tracking-wide ${isLanding ? 'text-blue-900' : 'text-gray-900'}`}>
                            OCCASIA
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                            Home
                        </Link>
                        <Link to={APP_ROUTES.SERVICES} className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                            Services
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <Link to={APP_ROUTES.MY_BOOKINGS} className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                    My Bookings
                                </Link>
                                <div className="h-4 w-px bg-gray-300"></div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to={APP_ROUTES.LOGIN}
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to={APP_ROUTES.REGISTER}
                                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link
                            to="/"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to={APP_ROUTES.SERVICES}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => setIsOpen(false)}
                        >
                            Services
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={APP_ROUTES.MY_BOOKINGS}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                    onClick={() => setIsOpen(false)}
                                >
                                    My Bookings
                                </Link>
                                <div className="border-t border-gray-100 my-2 pt-2">
                                    <div className="flex items-center px-3 py-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs mr-3">
                                            {user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                                <Link
                                    to={APP_ROUTES.LOGIN}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Log In
                                </Link>
                                <Link
                                    to={APP_ROUTES.REGISTER}
                                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 text-center mx-3"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
