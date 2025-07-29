import React from 'react';

const StatCard = ({ icon, title, value, bgColor }) => {
    return (
        // ✅ PERUBAHAN: Menggunakan warna tema untuk teks
        <div className={`p-4 rounded-xl flex items-center gap-4 ${bgColor}`}>
            <div className="flex-shrink-0 p-3 bg-white/30 rounded-lg">
                {icon}
            </div>
            <div>
                <p className="text-xs sm:text-sm text-gray-700 font-medium">{title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;