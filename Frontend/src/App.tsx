import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Search } from 'lucide-react';
import RegisterPage from './pages/RegisterPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ServicesPage from './pages/ServicesPage';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import { APP_ROUTES } from './constants/routes';

function AppContent() {
    const location = useLocation();

    // Pages that should NOT show the navbar
    const authPages = [
        APP_ROUTES.REGISTER,
        APP_ROUTES.LOGIN,
        APP_ROUTES.ADMIN_LOGIN,
        APP_ROUTES.ADMIN_DASHBOARD,
        APP_ROUTES.VERIFY_OTP
    ];

    const showNavbar = !authPages.includes(location.pathname as any);

    return (
        <div className="poise-container fade-in">
            {/* Header Section - Only shown after login (non-auth pages) */}
            {showNavbar && (
                <header className="poise-header p-0">
                    <nav className="poise-nav">
                        <div className="poise-nav-item border-l-0" style={{ flex: '2', justifyContent: 'flex-start', paddingLeft: '40px' }}>
                            <div className="poise-logo font-serif p-0 leading-none">OCCASIA</div>
                        </div>
                        <Link to={APP_ROUTES.SERVICES} className="poise-nav-item">Services</Link>
                        <Link to={APP_ROUTES.DASHBOARD} className="poise-nav-item">Dashboard</Link>
                    </nav>
                </header>
            )}

            {/* Main Content Sections */}
            <main className="flex-1 flex flex-col">
                <Routes>
                    <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
                    <Route path={APP_ROUTES.VERIFY_OTP} element={<VerifyOtpPage />} />
                    <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
                    <Route path={APP_ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />

                    <Route path={APP_ROUTES.ADMIN_DASHBOARD} element={
                        <RoleProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminDashboardPage />
                        </RoleProtectedRoute>
                    } />

                    <Route path={APP_ROUTES.DASHBOARD} element={
                        <RoleProtectedRoute allowedRoles={['USER', 'VENDOR']}>
                            <DashboardPage />
                        </RoleProtectedRoute>
                    } />

                    <Route path={APP_ROUTES.SERVICES} element={<ServicesPage />} />
                    <Route path="/" element={<Navigate to={APP_ROUTES.REGISTER} replace />} />
                </Routes>
            </main>

            <Toaster position="top-right" toastOptions={{
                style: {
                    borderRadius: '0',
                    background: '#000',
                    color: '#fff',
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.8rem',
                    letterSpacing: '0.1em'
                }
            }} />
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
