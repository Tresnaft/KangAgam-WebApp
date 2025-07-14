import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const UserLayout = () => {
    return (
        // Tambahkan 'overflow-x-hidden' di sini
        <div className="bg-[#FFFBEB] min-h-screen p-4 sm:p-6 md:p-8 overflow-x-hidden">
            {/* Kartu konten utama */}
            <div className="w-full max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8">
                <Navbar />
                <main className="mt-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserLayout;