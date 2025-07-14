import React, { useState } from 'react';

const KosakataCard = ({ content }) => {
    const [isWiggling, setIsWiggling] = useState(false);

    const colors = [
        'bg-yellow-100 text-yellow-800',
        'bg-green-100 text-green-800',
        'bg-blue-100 text-blue-800',
        'bg-red-100 text-red-800',
        'bg-purple-100 text-purple-800',
        'bg-teal-100 text-teal-800',
    ];

    const randomColor = colors[Math.floor(Math.random() * colors.length)]; 

    const handleClick = () => {
        if (isWiggling) return;

        setIsWiggling(true);
        console.log(`Memutar audio untuk: ${content}`);

        setTimeout(() => {
            setIsWiggling(false);
        }, 500); 
    };

    return (
        <button 
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
            className={`w-full max-w-full flex flex-col items-center justify-center p-2 text-center
                        bg-white shadow-md border border-gray-200 
                        transform hover:-translate-y-1 transition-all duration-300 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                        h-24 sm:h-28 md:h-32
                        ${isWiggling ? 'wiggle' : ''}`}
        >
            <h3 className="text-gray-800 text-base sm:text-lg font-bold tracking-wide line-clamp-2">
                {content}
            </h3>
        </button>
    );
};

export default KosakataCard;