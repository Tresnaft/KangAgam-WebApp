import React from 'react';

const StatCard = ({ icon, title, value, bgColor }) => {
    return (
        // The card itself is a flex container
        <div className={`p-4 rounded-xl flex items-center gap-4 ${bgColor}`}>
            {/* Icon container, fixed size */}
            <div className="flex-shrink-0 p-3 bg-white/30 rounded-lg">
                {icon}
            </div>
            {/* Text container, takes up the rest of the space */}
            <div>
                {/* Font size is now responsive: smaller on mobile, larger on desktop */}
                <p className="text-xs sm:text-sm text-gray-700 font-medium">{title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;