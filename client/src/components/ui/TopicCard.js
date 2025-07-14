import React from 'react';

const TopicCard = ({ title, imageUrl, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="w-full max-w-full flex flex-col items-center justify-center p-2 text-center
                       bg-white shadow-md border border-gray-200 
                       transform hover:-translate-y-1 transition-all duration-300 ease-in-out
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                       h-24 sm:h-28 md:h-32" // Tinggi fleksibel berdasarkan ukuran layar
        >
            <h3 className="text-gray-800 text-base sm:text-lg font-bold tracking-wide line-clamp-2">
                {title}
            </h3>
        </button>
    );
};

export default TopicCard;