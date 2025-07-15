import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Ikon-ikon
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;

const AdminMobileMenu = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleLogout = () => {
        onClose();
        logout();
        navigate('/admin/login');
    };

    return (
        <div className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true"></div>
            <div onClick={(e) => e.stopPropagation()} className={`relative ml-auto h-full w-3/4 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-end p-4 border-b">
                    <button onClick={onClose} className="p-2 text-gray-600 hover:text-black" aria-label="Tutup menu">
                        <CloseIcon />
                    </button>
                </div>
                <nav className="p-4 flex-grow">
                    <Link to="/admin/dashboard" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                        <HomeIcon />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/manage-topics" onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100">
                        <BookIcon />
                        <span>Kelola Topik</span>
                    </Link>
                </nav>
                <div className="p-4 border-t">
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50">
                        <LogoutIcon />
                        <span>Keluar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminMobileMenu;