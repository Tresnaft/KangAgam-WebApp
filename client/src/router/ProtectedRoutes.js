import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingIndicator from '../components/ui/LoadingIndicator';

// Penjaga untuk rute PENGGUNA BIASA (cth: /home, /topik/:id)
export const ProtectedRoutes = () => {
    const { user, isAuthLoading } = useAuth();
    
    if (isAuthLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingIndicator />
            </div>
        );
    }

    // Jika tidak ada user sama sekali, arahkan ke halaman onboarding (awal)
    if (!user) {
        return <Navigate to="/" replace />;
    }

    const userRole = user.role?.toLowerCase();

    // --- PERBAIKAN UTAMA DI SINI ---
    // Izinkan akses jika pengguna adalah 'user', 'admin', atau 'superadmin'.
    // Dengan ini, admin yang sedang login bisa membuka halaman publik seperti /home atau /topik/:id.
    if (userRole === 'user' || userRole === 'admin' || userRole === 'superadmin') {
        return <Outlet />;
    }

    // Jika karena alasan lain user tidak memiliki peran yang valid, kembalikan ke awal.
    return <Navigate to="/" replace />;
};

// Penjaga untuk rute ADMIN (cth: /admin/dashboard)
// TIDAK ADA PERUBAHAN DI SINI. Logika ini sudah benar.
export const AdminRoute = () => {
    const { user, isAuthLoading } = useAuth();

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
