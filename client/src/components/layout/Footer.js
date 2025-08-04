import React, { useState, useEffect } from 'react';

const logoBalaiBahasa = '/assets/images/logo/tut-wuri-handayani.svg';

const Footer = ({ totalUniqueVisitors }) => {
    return (
        <footer className="bg-background-secondary text-text mt-8 border-t border-gray-200 dark:border-gray-700/50">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* ✅ PERBAIKAN: Menambah jarak antar baris di mobile */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-center">
                    
                    {/* Kolom 1: Identitas Balai Bahasa */}
                    {/* ✅ PERBAIKAN: Layout diubah menjadi vertikal di mobile (flex-col) */}
                    <div className="flex flex-col items-center md:flex-row md:justify-start gap-4">
                        <img src={logoBalaiBahasa} alt="Logo Balai Bahasa" className="h-14" />
                        {/* ✅ PERBAIKAN: Teks dibuat rata tengah di mobile */}
                        <div className="text-center md:text-left">
                            <p className="text-base font-bold text-gray-800 dark:text-gray-100 leading-tight">BALAI BAHASA</p>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-tight">PROVINSI JAWA BARAT</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight mt-1">BADAN PENGEMBANGAN DAN PEMBINAAN BAHASA</p>
                        </div>
                    </div>

                    {/* Kolom 2: Statistik Pengunjung */}
                    <div className="text-center">
                        <p className="text-sm text-text-secondary">Total Pengunjung Unik</p>
                        <p className="text-3xl font-bold text-primary">
                            {typeof totalUniqueVisitors === 'number' ? totalUniqueVisitors.toLocaleString('id-ID') : '...'}
                        </p>
                    </div>

                    {/* Kolom 3: Copyright */}
                    <div className="text-center md:text-right text-sm text-text-secondary">
                        <p>&copy; {new Date().getFullYear()} Kang Agam.</p>
                        <p>Kamus Daring Tiga Bahasa.</p>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;