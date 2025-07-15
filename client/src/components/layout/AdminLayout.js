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

            <div className="bg-[#DAE4EE] min-h-screen flex">
                {/* Sidebar hanya untuk desktop */}
                <Sidebar />
                
                {/* Kontainer konten utama */}
                {/* 1. Di mobile, h-screen & flex-col membuat header "sticky" */}
                <div className="flex-grow flex flex-col lg:ml-24 h-screen lg:h-auto">
                    
                    {/* Header hanya untuk mobile, tidak akan menyusut */}
                    <AdminHeader onMenuToggle={toggleMenu} />
                    
                    {/* 2. Area konten dengan padding dan bisa di-scroll */}
                    {/* overflow-y-auto akan membuat hanya area ini yang bisa di-scroll */}
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