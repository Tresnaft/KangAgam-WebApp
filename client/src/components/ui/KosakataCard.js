import React from 'react';

const KosakataCard = ({ 
    content, 
    imageUrl, 
    onCardClick, 
    isActive, 
    isPlaying, 
    isAnyAudioPlaying 
}) => {

    // Logika untuk menentukan gaya kartu disempurnakan.
    const highlightClasses = isPlaying 
        ? 'ring-4 ring-offset-2 ring-accent shadow-lg' // Efek glow saat audio kartu ini berjalan
        : isActive 
        ? 'ring-2 ring-primary' // Efek sorot saat kartu ini aktif
        : 'shadow-md'; // State normal

    // Menentukan apakah kartu bisa diklik.
    // Kartu menjadi non-aktif jika ada audio lain yang sedang diputar (dan itu bukan audio dari kartu ini).
    const isDisabled = isAnyAudioPlaying && !isPlaying;

    return (
        <div 
            onClick={isDisabled ? undefined : onCardClick} // Hanya bisa diklik jika tidak disabled
            role="button"
            tabIndex={isDisabled ? -1 : 0}
            onKeyDown={(e) => !isDisabled && (e.key === 'Enter' || e.key === ' ') && onCardClick()}
            // Menambahkan kelas untuk menonaktifkan kartu jika perlu
            className={`group w-full bg-background-secondary rounded-2xl overflow-hidden
                      transform transition-all duration-300
                      ${isDisabled 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'cursor-pointer hover:scale-105 active:scale-95'
                      }
                      ${highlightClasses}`}
        >
            <div className="w-full h-20 sm:h-24 bg-background">
                <img 
                    src={imageUrl} 
                    alt={content} 
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x200/e2e8f0/4a5568?text=?' }}
                    className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110" 
                />
            </div>
            <div className="p-3 text-center bg-primary/10">
                <p className="text-primary font-bold text-lg sm:text-xl">{content}</p>
            </div>
        </div>
    );
};

export default KosakataCard;