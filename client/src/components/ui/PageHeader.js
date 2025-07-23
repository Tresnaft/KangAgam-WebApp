import React from 'react';

// Ikon mata untuk jumlah kunjungan
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);


// 1. Komponen sekarang menerima prop 'visitCount'
const PageHeader = ({ title, children, visitCount }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left mb-6 md:mb-8">
            {/* 2. Bungkus judul dan visit count agar tetap bersama */}
            <div>
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">{title}</h1>
                    
                    {/* 3. Tampilkan visit count jika nilainya ada dan lebih dari 0 */}
                    {typeof visitCount === 'number' && visitCount > 0 && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full mt-1">
                            <EyeIcon />
                            <span>{visitCount.toLocaleString('id-ID')}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 sm:mt-0">
                {children}
            </div>
        </div>
    );
};

export default PageHeader;