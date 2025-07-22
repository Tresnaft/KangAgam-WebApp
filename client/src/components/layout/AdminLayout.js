import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import AdminMobileMenu from './AdminMobileMenu';

const AdminLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <AdminMobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />
            {/* Menggunakan class 'bg-background' yang akan berubah sesuai tema */}
            <div className="bg-background min-h-screen flex">
                <Sidebar />
                <div className="flex-grow flex flex-col lg:ml-24 h-screen lg:h-auto">
                    {/* Anda juga perlu memperbarui AdminHeader & AdminMobileMenu dengan class baru */}
                    <AdminHeader onMenuToggle={toggleMenu} />
                    <div className="flex-grow overflow-y-auto">
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