import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';

const UserLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const mainContentRef = useRef(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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

            <div className="bg-[#FFFBEB] sm:p-4 md:p-6 lg:p-8 min-h-screen">
                <div className="w-full bg-white/80 backdrop-blur-sm 
                             sm:max-w-full sm:mx-0 sm:rounded-none sm:shadow-none
                             min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-6rem)]
                             flex flex-col">
                    
                    <Navbar onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} className="sticky top-0 z-10" />
                    
                    <main 
                        ref={mainContentRef} 
                        className="relative flex-grow overflow-y-auto"
                    >
                        <div className="p-4 sm:p-6 md:p-8 w-full">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default UserLayout;