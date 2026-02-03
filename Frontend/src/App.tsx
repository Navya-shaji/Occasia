import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOtpPage from './pages/VerifyOtpPage';

import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import GuestRoute from './components/GuestRoute';
import { APP_ROUTES } from './constants/routes';

function AppContent() {
    const location = useLocation();

    // Pages that should NOT show the navbar
    const hideNavbarRoutes = [
        APP_ROUTES.ADMIN_LOGIN,
        APP_ROUTES.ADMIN_DASHBOARD,
    ];

    const showNavbar = !hideNavbarRoutes.includes(location.pathname as any);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            {showNavbar && <Navbar />}

            <main className="flex-1 flex flex-col pt-0">
                <Routes>
                    <Route path="/" element={<LandingPage />} />

                    {/* Auth Routes */}
                    <Route path={APP_ROUTES.REGISTER} element={<GuestRoute><RegisterPage /></GuestRoute>} />
                    <Route path={APP_ROUTES.VERIFY_OTP} element={<GuestRoute><VerifyOtpPage /></GuestRoute>} />
                    <Route path={APP_ROUTES.LOGIN} element={<GuestRoute><LoginPage /></GuestRoute>} />
                    <Route path={APP_ROUTES.ADMIN_LOGIN} element={<GuestRoute><AdminLoginPage /></GuestRoute>} />

                    {/* Admin Routes */}
                    <Route path={APP_ROUTES.ADMIN_DASHBOARD} element={
                        <RoleProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminDashboardPage />
                        </RoleProtectedRoute>
                    } />



                    <Route path={APP_ROUTES.MY_BOOKINGS} element={
                        <RoleProtectedRoute allowedRoles={['USER', 'VENDOR']}>
                            <MyBookingsPage />
                        </RoleProtectedRoute>
                    } />

                    <Route path={APP_ROUTES.BOOKING_DETAILS} element={
                        <RoleProtectedRoute allowedRoles={['USER', 'VENDOR']}>
                            <BookingDetailsPage />
                        </RoleProtectedRoute>
                    } />

                    {/* Public Service Routes */}
                    <Route path={APP_ROUTES.SERVICES} element={<ServicesPage />} />
                    <Route path={APP_ROUTES.SERVICE_DETAILS} element={<ServiceDetailsPage />} />
                </Routes>
            </main>

            <Toaster
                position="top-center"
                toastOptions={{
                    className: '',
                    style: {
                        borderRadius: '8px',
                        background: '#333',
                        color: '#fff',
                    },
                }}
            />
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
