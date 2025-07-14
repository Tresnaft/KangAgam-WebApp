import React, { useState } from 'react'; // <-- Import useState
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/images/logo-kang-agam.png';
import MobileMenu from './MobileMenu'; // <-- 1. Import komponen MobileMenu

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // <-- 2. State untuk mengontrol menu
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <>
            <header className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200">
                <Link to="/home">
                    <img src={logo} alt="Kang Agam Logo" className="h-9 sm:h-10 w-auto" />
                </Link>
                
                {/* Navigasi untuk Desktop (hidden on mobile) */}
                <nav className="hidden sm:flex items-center gap-3 sm:gap-4">
                    <a href="#" className="text-sm text-gray-600 hover:text-black font-medium">{t('menuA')}</a>
                    <a href="#" className="text-sm text-gray-600 hover:text-black font-medium">{t('menuB')}</a>
                    <div className="flex items-center">
                        <select
                            id="bahasa-nav"
                            name="bahasa"
                            className="bg-gray-100 border-gray-300 rounded-lg pl-2 pr-7 py-1.5 text-sm focus:ring-1 focus:ring-indigo-500"
                            onChange={changeLanguage}
                            value={i18n.language}
                        >
                            <option value="id">Indonesia</option>
                            <option value="en">Inggris</option>
                            <option value="su">Sunda</option>
                        </select>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-[#FCE0E0] text-[#D95353] text-sm font-bold px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                    >
                        {t('logoutButton')}
                    </button>
                </nav>

                {/* 3. Tombol Hamburger (visible on mobile only) */}
                <div className="sm:hidden">
                    <button onClick={toggleMenu} className="p-2 focus:outline-none z-50">
                        {/* Ini adalah ikon hamburger yang akan berubah menjadi 'X' */}
                        <div className="w-6 h-[2px] bg-gray-700 mb-1.5 transition-all duration-300" style={{ transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></div>
                        <div className="w-6 h-[2px] bg-gray-700 transition-all duration-300" style={{ opacity: isMenuOpen ? 0 : 1 }}></div>
                        <div className="w-6 h-[2px] bg-gray-700 mt-1.5 transition-all duration-300" style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></div>
                    </button>
                </div>
            </header>

            {/* 4. Render MobileMenu di sini */}
            <MobileMenu isOpen={isMenuOpen} onClose={toggleMenu} />
        </>
    );
};

export default Navbar;