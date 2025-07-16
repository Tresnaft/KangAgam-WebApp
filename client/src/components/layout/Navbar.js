import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const logo = '/assets/images/logo-kang-agam.png';

const Navbar = ({ onMenuToggle, isMenuOpen }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <header className="flex items-center justify-between gap-4 py-4 px-4 sm:px-6 md:px-8 border-b border-gray-200 bg-white">
            <Link to="/home">
                <img src={logo} alt="Kang Agam Logo" className="h-9 sm:h-10 w-auto" />
            </Link>
            
            <nav className="hidden sm:flex items-center gap-3 sm:gap-4">
                <a href="#" className="text-sm text-gray-600 hover:text-black font-medium">{t('menuA')}</a>
                <a href="#" className="text-sm text-gray-600 hover:text-black font-medium">{t('menuB')}</a>
                <div className="flex items-center">
                    <select
                        id="bahasa-nav-desktop"
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

            <div className="sm:hidden">
                <button onClick={onMenuToggle} className="p-2 -mr-2 focus:outline-none z-50 relative" aria-label="Buka menu">
                    <div className="w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300" style={{ transform: isMenuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }}></div>
                    <div className="w-6 h-0.5 bg-gray-700 rounded-full my-1.5 transition-all duration-300" style={{ opacity: isMenuOpen ? 0 : 1 }}></div>
                    <div className="w-6 h-0.5 bg-gray-700 rounded-full transition-all duration-300" style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }}></div>
                </button>
            </div>
        </header>
    );
};

export default Navbar;