import React, { useState } from 'react';

const KosakataCard = ({ content }) => {
    // State untuk melacak apakah kartu sedang dalam animasi "wiggle"
    const [isWiggling, setIsWiggling] = useState(false);

    // Palet warna yang bisa digunakan agar bervariasi seperti di desain
    // Anda bisa menambahkan lebih banyak warna di sini
    const colors = [
        'bg-yellow-100 text-yellow-800',
        'bg-green-100 text-green-800',
        'bg-blue-100 text-blue-800',
        'bg-red-100 text-red-800',
        'bg-purple-100 text-purple-800',
        'bg-teal-100 text-teal-800',
    ];

    // Pilih warna secara acak atau berurutan berdasarkan konten/index
    // Untuk contoh ini, kita pilih warna pertama
    const randomColor = colors[0]; 

    // Fungsi yang dijalankan saat kartu diklik
    const handleClick = () => {
        // Mencegah animasi berjalan lagi jika sedang berjalan
        if (isWiggling) return;

        // 1. Aktifkan animasi
        setIsWiggling(true);

        // 2. Logika audio (dinonaktifkan sementara)
        // Di sini nanti Anda akan memanggil file audio yang sesuai
        // const audio = new Audio(`/audio/${content}.mp3`);
        // audio.play();
        console.log(`Memutar audio untuk: ${content}`);

        // 3. Matikan animasi setelah selesai (500ms) agar bisa di-klik lagi
        // Durasi ini harus sama dengan durasi animasi di file CSS
        setTimeout(() => {
            setIsWiggling(false);
        }, 500); 
    };

    return (
        // Gunakan div dengan role="button" agar aksesibel
        <div 
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()} // Agar bisa diakses dengan keyboard
            // Class ditambahkan secara dinamis
            className={`flex items-center justify-center h-24 sm:h-28 rounded-xl shadow-md cursor-pointer select-none
                        font-bold text-3xl sm:text-4xl
                        transform transition-transform hover:scale-105 active:scale-95
                        ${randomColor} 
                        ${isWiggling ? 'wiggle' : ''}`}
        >
            {content}
        </div>
    );
};

export default KosakataCard;