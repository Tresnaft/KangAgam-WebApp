import React, { useState } from 'react';

const KosakataCard = ({ content, imageUrl, audioUrl, onCardClick, isActive }) => {
    const [isWiggling, setIsWiggling] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleClick = () => {
        // ... (Logika klik tetap sama)
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

    // ✅ Mengubah ring-blue-500 menjadi ring-primary dan ring-yellow-400 menjadi ring-accent
    const highlightClasses = isPlaying 
        ? 'ring-4 ring-offset-2 ring-accent shadow-lg' 
        : isActive 
        ? 'ring-2 ring-primary'
        : 'shadow-md';

    return (
        <div 
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
            // ✅ Mengubah bg-white menjadi bg-background-secondary
            className={`group w-full bg-background-secondary rounded-2xl overflow-hidden cursor-pointer
                      transform transition-all duration-300 hover:scale-105 active:scale-95
                      ${isWiggling ? 'wiggle' : ''}
                      ${highlightClasses}`}
        >
            {/* ✅ Mengubah bg-gray-100 menjadi bg-background */}
            <div className="w-full h-20 sm:h-24 bg-background">
                <img 
                    src={imageUrl} 
                    alt={content} 
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x200/e2e8f0/4a5568?text=?' }}
                    className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110" 
                />
            </div>
            {/* ✅ Mengubah bg-blue-100 dan text-blue-800 menjadi warna tema */}
            <div className="p-3 text-center bg-primary/10">
                <p className="text-primary font-bold text-lg sm:text-xl">{content}</p>
            </div>
        </div>
    );
};

export default KosakataCard;