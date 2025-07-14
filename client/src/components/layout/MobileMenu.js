import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const MobileMenu = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = () => {
        onClose();
        logout();
        navigate('/');
    };

    return (
        <div 
            className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
                        ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white shadow-xl
                            transform transition-transform duration-300 ease-in-out z-50
                            flex flex-col`} // <-- Tambahkan flex flex-col di sini
                style={{ visibility: isOpen ? 'visible' : 'hidden' }} // <-- Kontrol visibilitas
            >
                {/* Header Menu dengan tombol tutup */}
                <div className="flex justify-end p-4 border-b">
                    <button onClick={onClose} className="p-2 text-gray-600 hover:text-black">
                        <CloseIcon />
                    </button>
                </div>

                {/* Konten Menu */}
                <nav className="p-6 flex-grow"> {/* <-- Gunakan flex-grow agar bisa mendorong logout ke bawah */}
                    <Link to="#" onClick={onClose} className="block text-lg font-medium text-gray-700 py-3 hover:text-indigo-600">{t('menuA')}</Link>
                    <Link to="#" onClick={onClose} className="block text-lg font-medium text-gray-700 py-3 hover:text-indigo-600">{t('menuB')}</Link>
                </nav>
                
                {/* Wrapper untuk tombol Logout agar memiliki padding */}
                <div className="p-6 pt-0">
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