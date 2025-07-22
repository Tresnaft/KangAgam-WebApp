import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // State sekarang menyimpan nama tema, bukan lagi true/false
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        
        // Hapus class 'dark' lama untuk memastikan sistem baru yang bekerja
        root.classList.remove('dark');
        
        // Atur atribut data-theme di tag <html>
        root.setAttribute('data-theme', theme);

        // Simpan pilihan tema ke localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Fungsi untuk mengganti tema
    const changeTheme = (themeName) => {
        setTheme(themeName);
    };

    const value = {
        theme,
        changeTheme, // Ganti nama dari toggleTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};