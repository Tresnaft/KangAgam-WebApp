import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';
import { useAuth } from '../../context/AuthContext';

const UserLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [totalUniqueVisitors, setTotalUniqueVisitors] = useState(0);
    const { user, token } = useAuth(); 

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/visitor-logs/stats`);
                setTotalUniqueVisitors(response.data.totalUniqueVisitors || 0);
            } catch (error) {
                console.error('Failed to fetch visitor stats:', error);
                setTotalUniqueVisitors(0);
            }
        };
        
        fetchStats();
    }, []);

    return (
        <>
            <style>{`
                .stable-scrollbar {
                    scrollbar-gutter: stable;
                }
            `}</style>
            <MobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />
            {/* --- PERBAIKAN DI SINI: Hapus 'overflow-hidden' --- */}
            {/* Properti ini yang menyebabkan 'position: sticky' tidak berfungsi */}
            <div className="bg-background flex flex-col h-screen">
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm shadow-sm">
                    <Navbar
                        onMenuToggle={toggleMenu}
                        isMenuOpen={isMenuOpen}
                        totalUniqueVisitors={totalUniqueVisitors}
                    />
                </header>
                <main className="flex-grow overflow-y-auto stable-scrollbar">
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default UserLayout;