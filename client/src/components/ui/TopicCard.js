import React from 'react';

// Kita tidak akan mengubah props-nya, jadi tetap terima imageUrl
const TopicCard = ({ title, imageUrl, onClick }) => {
    return (
        <button 
            onClick={onClick}
            // Tambahkan class bg-gray-200 sebagai warna default
            className="relative w-full h-32 rounded-xl overflow-hidden group shadow-lg bg-gray-200 transform hover:-translate-y-1 transition-all duration-300"
        >
            {/* Beri komentar pada baris img ini untuk menonaktifkannya sementara */}
            {/* <img 
                src={imageUrl} 
                alt={title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
            /> 
            */}
            
            {/* Overlay Gelap */}
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-colors duration-300"></div>
            
            {/* Teks Judul di Tengah */}
            <div className="relative h-full flex items-center justify-center p-2">
                <h3 className="text-white text-lg font-bold tracking-wider text-center">{title}</h3>
            </div>
        </button>
    );
};

export default TopicCard;