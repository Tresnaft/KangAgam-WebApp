import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';

const UserLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <MobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />

            {/* Wrapper utama sekarang menjadi flex column setinggi layar */}
            <div className="bg-[#FFFBEB] flex flex-col min-h-screen">
                
                {/* Header dengan Navbar dibuat sticky di sini */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm shadow-sm">
                    <Navbar onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
                </header>

                {/* Konten utama sekarang menjadi area yang bisa di-scroll */}
                <main className="flex-grow overflow-y-auto">
                    {/* Outlet akan merender konten halaman (misal: KosakataPage) */}
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default UserLayout;