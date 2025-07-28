import React from 'react';

// Ikon mata untuk jumlah kunjungan
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const TopicCard = ({ title, imageUrl, onClick, visitCount }) => {
    return (
        <button 
            onClick={onClick}
            // ✅ Mengubah bg-white menjadi bg-background-secondary agar mengikuti tema
            className="group w-full bg-background-secondary rounded-2xl shadow-md overflow-hidden 
                       transform hover:-translate-y-1 transition-all 
                       duration-300 ease-in-out focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-primary flex flex-col"
        >
            {/* ✅ Mengubah bg-gray-200 menjadi bg-background */}
            <div className="w-full h-24 sm:h-28 bg-background">
                <img 
                    src={imageUrl} 
                    alt={title} 
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x200/e2e8f0/4a5568?text=Gambar' }}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                />
            </div>
            <div className="p-3 text-left flex-grow flex flex-col justify-between">
                {/* ✅ Mengubah text-gray-800 menjadi text-text */}
                <h3 className="text-text text-sm sm:text-base font-bold tracking-wider leading-tight">{title}</h3>
                
                {/* ✅ Mengubah text-gray-500 menjadi text-text-secondary */}
                <div className="flex items-center gap-1.5 mt-2 text-xs text-text-secondary">
                    {typeof visitCount === 'number' && visitCount > 0 ? (
                        <>
                            <EyeIcon />
                            <span>{visitCount.toLocaleString('id-ID')}</span>
                        </>
                    ) : (
                        <span>&nbsp;</span>
                    )}
                </div>
            </div>
        </button>
    );
};

export default TopicCard;