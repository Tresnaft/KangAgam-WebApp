import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    if (totalPages <= 1) {
        return (
            <div className="flex justify-between items-center mt-6">
                {/* ✅ PERUBAHAN: Menggunakan warna teks dari tema */}
                <p className="text-sm text-text-secondary">Total: <span className="font-bold text-text">{totalItems}</span> data</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            {/* ✅ PERUBAHAN: Menggunakan warna teks dari tema */}
            <p className="text-sm text-text-secondary">
                Halaman <span className="font-bold text-text">{currentPage}</span> dari <span className="font-bold text-text">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    // ✅ PERUBAHAN: Menggunakan warna dari tema untuk tombol
                    className="bg-background-secondary text-text text-sm font-bold w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Halaman sebelumnya"
                >
                    &larr;
                </button>
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        // ✅ PERUBAHAN: Menggunakan warna dari tema untuk tombol
                        className={`${
                            currentPage === number
                                ? 'bg-primary text-white border-primary'
                                : 'bg-background-secondary text-text border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
                        } text-sm font-bold w-8 h-8 rounded-md transition-colors`}
                    >
                        {number}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    // ✅ PERUBAHAN: Menggunakan warna dari tema untuk tombol
                    className="bg-background-secondary text-text text-sm font-bold w-8 h-8 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Halaman berikutnya"
                >
                    &rarr;
                </button>
            </div>
        </div>
    );
};

export default Pagination;