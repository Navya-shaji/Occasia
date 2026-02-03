import React from 'react';
import { Navigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants/routes';

interface GuestRouteProps {
    children: React.ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    if (token && user) {
        // Redirect to their respective dashboard if they are already logged in
        if (user.role === 'ADMIN') {
            return <Navigate to={APP_ROUTES.ADMIN_DASHBOARD} replace />;
        }
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default GuestRoute;
