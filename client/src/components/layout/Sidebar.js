import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeSwitcher from '../admin/ThemeSwitcher';

const logo = '/assets/images/logo-kang-agam.png';

// Ikon-ikon
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-3-5.197" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    // Menggunakan class warna semantik dari tailwind.config.js
    const navLinkClasses = "p-3 rounded-lg text-text-secondary hover:bg-background";
    const activeLinkClasses = "p-3 rounded-lg bg-primary/10 text-primary";

    return (
        <div className="hidden lg:flex w-24 bg-background-secondary h-screen flex-col items-center justify-between py-6 shadow-lg fixed">
            <div>
                <Link to="/admin/dashboard">
                    <img src={logo} alt="Logo" className="h-12 w-auto" />
                </Link>
                <nav className="flex flex-col items-center mt-12 space-y-6">
                    <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? activeLinkClasses : navLinkClasses} title="Dashboard">
                        <HomeIcon />
                    </NavLink>
                    <NavLink to="/admin/manage-topics" className={({ isActive }) => isActive ? activeLinkClasses : navLinkClasses} title="Kelola Topik">
                        <BookIcon />
                    </NavLink>
                    <NavLink to="/admin/manage-admins" className={({ isActive }) => isActive ? activeLinkClasses : navLinkClasses} title="Kelola Admin">
                        <UsersIcon />
                    </NavLink>
                    <NavLink to="/admin/statistics" className={({ isActive }) => isActive ? activeLinkClasses : navLinkClasses} title="Statistik">
                        <ChartIcon />
                    </NavLink>
                </nav>
            </div>
            
            <div className="flex flex-col items-center gap-4">
                <ThemeSwitcher />
                <button onClick={handleLogout} className="p-3 rounded-lg text-red-500 hover:bg-red-500/10" title="Logout">
                    <LogoutIcon />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;