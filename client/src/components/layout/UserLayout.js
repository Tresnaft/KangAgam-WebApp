import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';
import { useAuth } from '../../context/AuthContext';

const UserLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [totalUniqueVisitors, setTotalUniqueVisitors] = useState(0);
    const { token } = useAuth();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (!token) {
                    throw new Error('Token is not available.');
                }
                const response = await axios.get('http://localhost:5000/api/visitor-logs/stats', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalUniqueVisitors(response.data.totalUniqueVisitors || 0);
            } catch (error) {
                console.error('Failed to fetch visitor stats:', error);
                setTotalUniqueVisitors(0);
            }
        };
        fetchStats();
    }, [token]);

    return (
        <>
            {/* --- PERBAIKAN 1: Tambahkan style untuk scrollbar-gutter --- */}
            <style>{`
                .stable-scrollbar {
                    scrollbar-gutter: stable;
                }
            `}</style>
            <MobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />
            <div className="bg-[#FFFBEB] flex flex-col h-screen overflow-hidden">
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm shadow-sm">
                    <Navbar
                        onMenuToggle={toggleMenu}
                        isMenuOpen={isMenuOpen}
                        totalUniqueVisitors={totalUniqueVisitors}
                    />
                </header>
                {/* --- PERBAIKAN 2: Gunakan overflow-y-auto dan class baru --- */}
                <main className="flex-grow overflow-y-auto stable-scrollbar">
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default UserLayout;