import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo-kang-agam.png';

// Ikon untuk hamburger menu
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const AdminHeader = ({ onMenuToggle }) => {
    const { user } = useAuth();

    return (
        // Header ini hanya akan muncul di mobile (lg:hidden)
        <header className="lg:hidden flex items-center justify-between p-4 bg-white shadow-md">
            <Link to="/admin/dashboard">
                <img src={logo} alt="Kang Agam Logo" className="h-9 w-auto" />
            </Link>
            <div>
                <span className="text-sm text-gray-600 mr-4">Halo, {user?.email.split('@')[0] || 'Admin'}</span>
                <button onClick={onMenuToggle} className="p-2" aria-label="Buka menu">
                    <MenuIcon />
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
