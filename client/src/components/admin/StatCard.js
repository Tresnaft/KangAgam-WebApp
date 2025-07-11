import React from 'react';

const StatCard = ({ icon, title, value, bgColor }) => {
    return (
        <div className={`p-4 rounded-xl flex items-center gap-4 ${bgColor}`}>
            <div className="p-3 bg-white/30 rounded-lg">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-700">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;