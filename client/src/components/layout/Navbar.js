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
        // ✅ PERUBAHAN: Menggunakan warna tema, bukan warna spesifik
        <header className="flex items-center justify-between gap-4 py-4 px-4 sm:px-6 md:px-8 border-b border-background bg-background-secondary">
            <div className="flex items-center gap-4">
                <Link to="/home">
                    <img src={logo} alt="Kang Agam Logo" className="h-9 sm:h-10 w-auto" />
                </Link>
                {/* ✅ PERUBAHAN: Teks menggunakan warna tema */}
                <span className="text-sm text-text-secondary">Total Unique Visitors: {totalUniqueVisitors}</span>
            </div>

            <nav className="hidden sm:flex items-center gap-3 sm:gap-4">
                {/* ✅ PERUBAHAN: Teks menggunakan warna tema */}
                <a href="#" className="text-sm text-text-secondary hover:text-text font-medium">{t('menuA')}</a>
                <a href="#" className="text-sm text-text-secondary hover:text-text font-medium">{t('menuB')}</a>
                
                <UserThemeSwitcher />

                <div className="flex items-center">
                    {/* ✅ PERUBAHAN: Dropdown menggunakan warna tema */}
                    <select
                        id="bahasa-nav-desktop"
                        name="bahasa"
                        className="bg-background border-gray-300 dark:border-gray-600 rounded-lg pl-2 pr-7 py-1.5 text-sm text-text-secondary focus:ring-1 focus:ring-primary"
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
                    {/* ✅ PERUBAHAN: Ikon hamburger menggunakan warna tema */}
                    <div className="w-6 h-0.5 bg-text rounded-full transition-all duration-300" style={{ transform: isMenuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }}></div>
                    <div className="w-6 h-0.5 bg-text rounded-full my-1.5 transition-all duration-300" style={{ opacity: isMenuOpen ? 0 : 1 }}></div>
                    <div className="w-6 h-0.5 bg-text rounded-full transition-all duration-300" style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }}></div>
                </button>
            </div>
        </header>
    );
};

export default Navbar;