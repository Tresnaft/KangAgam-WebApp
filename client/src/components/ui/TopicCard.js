import React from 'react';

// Komponen Kartu Topik dengan gambar yang lebih menonjol
const TopicCard = ({ title, imageUrl, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="group w-full bg-white rounded-2xl shadow-md overflow-hidden 
                       transform hover:-translate-y-1 transition-all 
                       duration-300 ease-in-out focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            <div className="w-full h-24 sm:h-28 bg-gray-200">
                <img 
                    src={imageUrl} 
                    alt={title} 
                    // Placeholder jika gambar gagal dimuat
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x200/e2e8f0/4a5568?text=Gambar' }}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                />
            </div>
            <div className="p-3 text-center">
                <h3 className="text-gray-800 text-sm sm:text-base font-bold tracking-wider">{title}</h3>
            </div>
        </button>
    );
};

export default TopicCard;