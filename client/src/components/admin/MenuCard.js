import React from 'react';
import { Link } from 'react-router-dom';

const MenuCard = ({ icon, title, description, to }) => {
    return (
        <Link to={to} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center gap-6">
            <div className="p-4 bg-gray-100 rounded-lg">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </Link>
    );
};

export default MenuCard;