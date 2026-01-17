import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function ProtectedRoute({ children, role }) {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (role && user?.role !== role) {
        // Redirect unauthorized role to their default dashboard
        if (user?.role === 'admin') return <Navigate to="/admin" replace />;
        if (user?.role === 'vendor') return <Navigate to="/vendor" replace />;
        return <Navigate to="/" replace />;
    }

    // Optional: Redirect special roles from customer home to their dashboard
    if (!role && location.pathname === '/') {
        if (user?.role === 'admin') return <Navigate to="/admin" replace />;
        if (user?.role === 'vendor') return <Navigate to="/vendor" replace />;
    }

    return children;
}
