import React from 'react';
import { Navigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants/routes';

interface RoleProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');

    if (!token || !user) {
        return <Navigate to={APP_ROUTES.LOGIN} replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // Redirect to their respective dashboard if they don't have access
        if (user.role === 'ADMIN') {
            return <Navigate to={APP_ROUTES.ADMIN_DASHBOARD} replace />;
        }
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default RoleProtectedRoute;
