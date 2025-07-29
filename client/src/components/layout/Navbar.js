import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import UserThemeSwitcher from '../ui/UserThemeSwitcher';

const logo = '/assets/images/logo-kang-agam.png';

const Navbar = ({ onMenuToggle, isMenuOpen, totalUniqueVisitors }) => {
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
        <header className="bg-background-secondary border-b border-gray-200 dark:border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link to="/home">
                            <img src={logo} alt="Kang Agam Logo" className="h-9 sm:h-10 w-auto" />
                        </Link>
                        {/* ✅ PERUBAHAN: Warna teks dibuat lebih terang untuk kontras yang lebih baik */}
                        <span className="text-sm text-text-secondary font-medium">
                            {t('totalVisitors', { count: totalUniqueVisitors })}
                        </span>
                    </div>

                    <nav className="hidden sm:flex items-center gap-4">
                        {/* ✅ PERUBAHAN: Menu A dan Menu B dihapus */}
                        
                        <UserThemeSwitcher />

                        <div className="flex items-center">
                            {/* ✅ PERUBAHAN: Dropdown menggunakan warna yang lebih kontras */}
                            <select
                                id="bahasa-nav-desktop"
                                name="bahasa"
                                className="bg-background border border-gray-300 dark:border-gray-600 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-text-secondary focus:ring-1 focus:ring-primary"
                                onChange={changeLanguage}
                                value={i18n.language}
                            >
                                <option value="id">Indonesia</option>
                                <option value="su">Sunda</option>
                                <option value="en">Inggris</option>
                            </select>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500/10 text-red-500 text-sm font-bold px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                            {t('logoutButton')}
                        </button>
                    </nav>

                    <div className="sm:hidden">
                        <button onClick={onMenuToggle} className="p-2 -mr-2 focus:outline-none z-50 relative" aria-label="Buka menu">
                            <div className="w-6 h-0.5 bg-text rounded-full transition-all duration-300" style={{ transform: isMenuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }}></div>
                            <div className="w-6 h-0.5 bg-text rounded-full my-1.5 transition-all duration-300" style={{ opacity: isMenuOpen ? 0 : 1 }}></div>
                            <div className="w-6 h-0.5 bg-text rounded-full transition-all duration-300" style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }}></div>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;