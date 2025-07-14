import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Komponen ikon 'X' untuk tombol tutup
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const MobileMenu = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleLogout = () => {
        onClose(); // Tutup menu dulu
        logout();
        navigate('/');
    };

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    // 1. Wrapper utama sekarang 'fixed' dan 'inset-0' untuk menutupi seluruh layar.
    //    Ini memastikan backdrop dan menu tidak akan pernah ikut scroll.
    return (
        <div 
            className={`sm:hidden fixed inset-0 z-40 transition-opacity duration-300
                        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
            {/* Backdrop (latar belakang gelap) */}
            <div 
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden="true"
            ></div>
            
            {/* Panel Menu yang bergeser */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative ml-auto h-full w-3/4 max-w-sm bg-white shadow-xl
                            transform transition-transform duration-300 ease-in-out
                            flex flex-col
                            ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header Menu dengan tombol tutup */}
                <div className="flex justify-end p-4 border-b">
                    <button onClick={onClose} className="p-2 text-gray-600 hover:text-black" aria-label="Tutup menu">
                        <CloseIcon />
                    </button>
                </div>

                {/* Konten Menu Utama */}
                <nav className="p-6 flex-grow">
                    <Link to="#" onClick={onClose} className="block text-lg font-medium text-gray-700 py-3 hover:text-indigo-600">{t('menuA')}</Link>
                    <Link to="#" onClick={onClose} className="block text-lg font-medium text-gray-700 py-3 hover:text-indigo-600">{t('menuB')}</Link>
                </nav>
                
                {/* Footer Menu: Pilihan Bahasa dan Tombol Keluar */}
                <div className="p-6 border-t">
                    <div className="mb-4">
                        <label htmlFor="bahasa-mobile" className="block text-sm font-medium text-gray-500 mb-2">{t('languageLabel')}</label>
                        <select
                            id="bahasa-mobile"
                            name="bahasa"
                            className="w-full bg-gray-100 border-gray-300 rounded-lg px-3 py-2.5 text-base focus:ring-1 focus:ring-indigo-500"
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
                        className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        {t('logoutButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;