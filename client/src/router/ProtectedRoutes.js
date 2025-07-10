import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoutes = () => {
    const { user } = useAuth();

    if (!user || user.role !== 'user') {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export const AdminRoute = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};