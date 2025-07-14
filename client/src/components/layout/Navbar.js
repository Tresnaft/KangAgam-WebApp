import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import hook terjemahan
import logo from '../../assets/images/logo-kang-agam.png';

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation(); // Panggil hook

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <header className="flex items-center justify-between pb-4 border-b border-gray-200">
            <Link to="/home">
                <img src={logo} alt="Kang Agam Logo" className="h-10 w-auto" />
            </Link>
            <nav className="flex items-center gap-4 sm:gap-6">
                {/* TAMBAHKAN DROPDOWN BAHASA DI SINI */}
                <div className="flex items-center gap-2">
                    <label htmlFor="bahasa-nav" className="text-sm font-medium text-gray-700 sr-only">{t('languageLabel')}</label>
                    <select
                        id="bahasa-nav"
                        name="bahasa"
                        className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-indigo-500"
                        onChange={changeLanguage}
                        value={i18n.language}
                    >
                        <option value="id">Indonesia</option>
                        <option value="en">Inggris</option>
                        <option value="su">Sunda</option>
                    </select>
                </div>

                <a href="#" className="text-sm text-gray-600 hover:text-black font-medium">{t('menuA')}</a>
                <a href="#" className="text-sm text-gray-600 hover:text-black font-medium">{t('menuB')}</a>
                <button
                    onClick={handleLogout}
                    className="bg-[#FCE0E0] text-[#D95353] text-sm font-bold px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                >
                    {t('logoutButton')}
                </button>
            </nav>
        </header>
    );
};

export default Navbar;