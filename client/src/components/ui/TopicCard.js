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
            className="group w-full bg-white rounded-2xl shadow-md overflow-hidden 
                       transform hover:-translate-y-1 transition-all 
                       duration-300 ease-in-out focus:outline-none 
                       focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex flex-col"
        >
            <div className="w-full h-24 sm:h-28 bg-gray-200">
                <img 
                    src={imageUrl} 
                    alt={title} 
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x200/e2e8f0/4a5568?text=Gambar' }}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                />
            </div>
            {/* --- PERUBAHAN LAYOUT DIMULAI DI SINI --- */}
            <div className="p-3 text-left flex-grow flex flex-col justify-between">
                {/* Judul sekarang rata kiri */}
                <h3 className="text-gray-800 text-sm sm:text-base font-bold tracking-wider leading-tight">{title}</h3>
                
                {/* Tampilkan jumlah kunjungan jika ada */}
                {visitCount > 0 && (
                    // Rata kiri dengan margin atas
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                        <EyeIcon />
                        <span>{visitCount.toLocaleString('id-ID')}</span>
                    </div>
                )}
            </div>
            {/* --- PERUBAHAN LAYOUT SELESAI --- */}
        </button>
    );
};

export default TopicCard;