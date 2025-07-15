import React from 'react';
import { Link } from 'react-router-dom';

const MenuCard = ({ icon, title, description, to }) => {
    return (
        // Change to 'items-start' to align the icon to the top if text wraps
        <Link to={to} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-start gap-6">
            <div className="flex-shrink-0 p-4 bg-gray-100 rounded-lg mt-1">
                {icon}
            </div>
            <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
        </Link>
    );
};

export default MenuCard;