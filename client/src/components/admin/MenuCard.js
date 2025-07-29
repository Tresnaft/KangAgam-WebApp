import React from 'react';
import { Link } from 'react-router-dom';

const MenuCard = ({ icon, title, description, to }) => {
    return (
        // ✅ PERUBAHAN: Menggunakan warna tema untuk latar belakang dan teks
        <Link to={to} className="bg-background-secondary p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-start gap-6">
            <div className="flex-shrink-0 p-4 bg-background rounded-lg mt-1">
                {icon}
            </div>
            <div>
                <h3 className="text-base sm:text-lg font-bold text-text">{title}</h3>
                <p className="text-sm text-text-secondary mt-1">{description}</p>
            </div>
        </Link>
    );
};

export default MenuCard;