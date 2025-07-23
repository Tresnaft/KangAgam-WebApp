import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';
import { useAuth } from '../../context/AuthContext';

const UserLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [totalUniqueVisitors, setTotalUniqueVisitors] = useState(0);
    const { token } = useAuth(); // Destructure token instead of getToken

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (!token) {
                    throw new Error('Token is not available.');
                }
                const response = await axios.get('http://localhost:5000/api/visitor-logs/stats', {
                    headers: { Authorization: `Bearer ${token}` }, // Use token directly
                });
                setTotalUniqueVisitors(response.data.totalUniqueVisitors || 0);
            } catch (error) {
                console.error('Failed to fetch visitor stats:', error);
                setTotalUniqueVisitors(0); // Default to 0 on error
            }
        };
        fetchStats();
    }, [token]);

    return (
        <>
            <MobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />
            <div className="bg-[#FFFBEB] flex flex-col h-screen overflow-hidden">
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm shadow-sm">
                    <Navbar
                        onMenuToggle={toggleMenu}
                        isMenuOpen={isMenuOpen}
                        totalUniqueVisitors={totalUniqueVisitors}
                    />
                </header>
                {/* --- PERBAIKAN DI SINI --- */}
                {/* Mengubah overflow-y-auto menjadi overflow-y-scroll */}
                {/* Ini akan membuat scrollbar selalu ada (tapi nonaktif jika tidak perlu), */}
                {/* sehingga menghilangkan efek flicker saat pindah halaman. */}
                <main className="flex-grow overflow-y-scroll">
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default UserLayout;