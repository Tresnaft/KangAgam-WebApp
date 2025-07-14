import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';

const UserLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const mainContentRef = useRef(null); // Ref untuk menargetkan area scroll

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Efek untuk mengunci scroll pada area konten utama saat menu mobile terbuka
    useEffect(() => {
        const mainContent = mainContentRef.current;
        if (mainContent) {
            if (isMenuOpen) {
                mainContent.style.overflow = 'hidden';
            } else {
                mainContent.style.overflow = 'auto';
            }
        }
    }, [isMenuOpen]);

    return (
        <>
            <MobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />

            <div className="bg-[#FFFBEB] sm:p-4 md:p-6 lg:p-8">
                {/* "Base" putih, yang sekarang menjadi flex container dengan tinggi layar penuh di mobile */}
                <div className="w-full bg-white/80 backdrop-blur-sm 
                             sm:max-w-6xl sm:mx-auto sm:rounded-2xl sm:shadow-lg 
                             h-screen sm:h-auto sm:min-h-[calc(100vh-4rem)]
                             flex flex-col">
                    
                    {/* Navbar akan selalu berada di atas */}
                    <Navbar onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
                    
                    {/* Konten utama yang bisa di-scroll */}
                    {/* 'overflow-y-auto' adalah kunci yang membuat area ini bisa di-scroll */}
                    <main 
                        ref={mainContentRef} 
                        className="relative flex-grow overflow-y-auto"
                    >
                        {/* Padding sekarang diterapkan di dalam area scroll */}
                        <div className="p-4 sm:p-6 md:p-8">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default UserLayout;