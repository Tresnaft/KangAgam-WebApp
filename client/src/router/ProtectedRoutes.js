import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingIndicator from '../components/ui/LoadingIndicator'; // Import loading indicator

// Penjaga untuk rute PENGGUNA BIASA (cth: /home, /topik/:id)
export const ProtectedRoutes = () => {
    const { user, isAuthLoading } = useAuth();
    
    // --- PERBAIKAN 1: Tampilkan loading jika status auth belum selesai dicek ---
    if (isAuthLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingIndicator />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    const userRole = user.role?.toLowerCase();

    if (userRole === 'user') {
        return <Outlet />;
    }

    if (userRole === 'admin' || userRole === 'superadmin') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
};

// Penjaga untuk rute ADMIN (cth: /admin/dashboard)
export const AdminRoute = () => {
    const { user, isAuthLoading } = useAuth();

    // --- PERBAIKAN 2: Tampilkan loading jika status auth belum selesai dicek ---
    if (isAuthLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingIndicator />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    const userRole = user.role?.toLowerCase();

    if (userRole === 'admin' || userRole === 'superadmin') {
        return <Outlet />;
    }

    if (userRole === 'user') {
        return <Navigate to="/home" replace />;
    }

    return <Navigate to="/admin/login" replace />;
};