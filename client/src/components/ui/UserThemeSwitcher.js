import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

// Komponen Ikon SVG untuk setiap tema
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const SunsetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10V3M15.24 12.24l4.95-4.95M10 21h4M3.5 13.5h17M12 17.5c-3.866 0-7-1.567-7-3.5s3.134-3.5 7-3.5 7 1.567 7 3.5-3.134 3.5-7 3.5z" /></svg>;


const UserThemeSwitcher = () => {
    // 1. Ambil tema saat ini dan fungsi untuk mengubahnya dari context
    const { theme, changeTheme } = useTheme();
    
    // 2. Definisikan urutan siklus tema
    const themes = ['light', 'dark', 'sunset'];
    
    // 3. Fungsi untuk mengganti ke tema berikutnya
    const handleThemeChange = () => {
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length; // 0, 1, 2, 0, 1, ...
        changeTheme(themes[nextIndex]);
    };
    
    // 4. Pilih ikon yang sesuai dengan tema saat ini
    const renderIcon = () => {
        if (theme === 'dark') return <MoonIcon />;
        if (theme === 'sunset') return <SunsetIcon />;
        return <SunIcon />; // Default ke ikon matahari
    };
    
    return (
        <motion.button
            onClick={handleThemeChange}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
            title="Ganti Tema"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            // Gunakan key untuk memicu animasi saat ikon berubah
            key={theme} 
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            {renderIcon()}
        </motion.button>
    );
};

export default UserThemeSwitcher;