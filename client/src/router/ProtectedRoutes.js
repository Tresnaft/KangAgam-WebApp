import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Penjaga untuk rute PENGGUNA BIASA (cth: /home, /topik/:id)
export const ProtectedRoutes = () => {
    const { user } = useAuth();
    
    // Jika tidak ada pengguna yang login sama sekali, lempar ke halaman onboarding.
    if (!user) {
        return <Navigate to="/" replace />;
    }

    const userRole = user.role?.toLowerCase();

    // Jika pengguna yang login adalah 'user', izinkan akses.
    if (userRole === 'user') {
        return <Outlet />;
    }

    // --- PERBAIKAN UTAMA ---
    // Jika pengguna yang login adalah 'admin' atau 'superadmin' tapi mencoba
    // mengakses halaman pengguna, lempar mereka ke dasbor admin mereka sendiri.
    if (userRole === 'admin' || userRole === 'superadmin') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Fallback jika terjadi kondisi aneh
    return <Navigate to="/" replace />;
};

// Penjaga untuk rute ADMIN (cth: /admin/dashboard)
export const AdminRoute = () => {
    const { user } = useAuth();

    // Jika tidak ada pengguna yang login, lempar ke halaman login admin.
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    const userRole = user.role?.toLowerCase();

    // Jika pengguna yang login adalah 'admin' atau 'superadmin', izinkan akses.
    if (userRole === 'admin' || userRole === 'superadmin') {
        return <Outlet />;
    }

    // --- PERBAIKAN UTAMA ---
    // Jika pengguna yang login adalah 'user' tapi mencoba mengakses
    // halaman admin, lempar mereka ke halaman utama mereka.
    if (userRole === 'user') {
        return <Navigate to="/home" replace />;
    }

    // Fallback jika terjadi kondisi aneh
    return <Navigate to="/admin/login" replace />;
};