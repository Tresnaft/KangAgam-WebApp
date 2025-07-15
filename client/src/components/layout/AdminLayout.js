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
            {/* Menu geser untuk mobile */}
            <AdminMobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />

            <div className="bg-[#DAE4EE] min-h-screen flex">
                {/* Sidebar hanya untuk desktop */}
                <Sidebar />
                
                {/* Kontainer konten utama */}
                {/* Diberi margin kiri seukuran lebar sidebar hanya di desktop (lg) */}
                <div className="flex-grow flex flex-col lg:ml-24">
                    
                    {/* Header hanya untuk mobile */}
                    <AdminHeader onMenuToggle={toggleMenu} />
                    
                    {/* Area konten dengan padding */}
                    <div className="p-4 sm:p-8 flex-grow">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;