import React from 'react';
import { useTheme } from '../../context/ThemeContext';

// Definisikan tema yang tersedia
const themes = [
    { name: 'light', color: '#5270FD' }, // Biru
    { name: 'dark', color: '#111827' },  // Hitam
    { name: 'sunset', color: '#F97316' }, // Oranye
];

const ThemeSwitcher = () => {
    const { theme, changeTheme } = useTheme();

    return (
        <div className="flex items-center gap-2 p-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
            {themes.map((t) => (
                <button
                    key={t.name}
                    onClick={() => changeTheme(t.name)}
                    className={`w-6 h-6 rounded-full transition-transform duration-200 focus:outline-none
                        ${ theme === t.name ? 'ring-2 ring-offset-2 ring-primary ring-offset-background-secondary' : '' }
                    `}
                    style={{ backgroundColor: t.color }}
                    title={`Ganti ke tema ${t.name}`}
                />
            ))}
        </div>
    );
};

export default ThemeSwitcher;