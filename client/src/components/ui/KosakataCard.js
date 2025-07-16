import React, { useState } from 'react';

// Komponen Kartu Kosakata dengan efek saat audio berjalan dan saat aktif
const KosakataCard = ({ content, imageUrl, audioUrl, onCardClick, isActive }) => {
    const [isWiggling, setIsWiggling] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false); // State untuk melacak status audio

    const handleClick = () => {
        if (isPlaying || !audioUrl || audioUrl === '#') return;

        if (onCardClick) {
            onCardClick();
        }

        try {
            const audio = new Audio(audioUrl);
            
            audio.onplay = () => setIsPlaying(true);
            audio.onended = () => setIsPlaying(false);
            audio.onerror = () => {
                console.error("Gagal memuat atau memutar audio:", audioUrl);
                setIsPlaying(false);
            };

            audio.play();
        } catch (error) {
            console.error("Gagal membuat objek Audio:", error);
        }

        if (isWiggling) return;
        setIsWiggling(true);
        setTimeout(() => {
            setIsWiggling(false);
        }, 500);
    };

    // FIX: Logika kelas CSS yang lebih canggih untuk menangani 3 state: normal, aktif, dan sedang diputar
    const highlightClasses = isPlaying 
        ? 'ring-4 ring-offset-2 ring-yellow-400 shadow-lg' // Efek glow saat audio berjalan (paling prioritas)
        : isActive 
        ? 'ring-2 ring-blue-500' // Efek sorot saat kartu aktif
        : 'shadow-md'; // State normal

    return (
        <div 
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
            className={`group w-full bg-white rounded-2xl overflow-hidden cursor-pointer
                        transform transition-all duration-300 hover:scale-105 active:scale-95
                        ${isWiggling ? 'wiggle' : ''}
                        ${highlightClasses}`} // Terapkan kelas dinamis di sini
        >
            <div className="w-full h-20 sm:h-24 bg-gray-100">
                <img 
                    src={imageUrl} 
                    alt={content} 
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x200/e2e8f0/4a5568?text=?' }}
                    className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110" 
                />
            </div>
            <div className="p-3 text-center bg-blue-100">
                <p className="text-blue-800 font-bold text-lg sm:text-xl">{content}</p>
            </div>
        </div>
    );
};

export default KosakataCard;