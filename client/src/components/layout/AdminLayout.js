import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import AdminMobileMenu from './AdminMobileMenu';
import { useAuth } from '../../context/AuthContext';
import LoadingIndicator from '../ui/LoadingIndicator';

const AdminLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthLoading } = useAuth();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    if (isAuthLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <LoadingIndicator />
            </div>
        );
    }

    return (
        <>
            {/* --- PERBAIKAN 1: Tambahkan style untuk scrollbar-gutter --- */}
            {/* Ini akan memesan ruang untuk scrollbar tanpa menampilkannya jika tidak perlu */}
            <style>{`
                .stable-scrollbar {
                    scrollbar-gutter: stable;
                }
            `}</style>
            <AdminMobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />
            <div className="bg-background min-h-screen flex">
                <Sidebar />
                <div className="flex-grow flex flex-col lg:ml-24 h-screen overflow-hidden">
                    <AdminHeader onMenuToggle={toggleMenu} />
                    {/* --- PERBAIKAN 2: Kembalikan ke overflow-y-auto dan tambahkan class baru --- */}
                    <div className="flex-grow overflow-y-auto stable-scrollbar">
                        <div className="p-4 sm:p-8">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;