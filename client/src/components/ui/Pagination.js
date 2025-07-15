import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    if (totalPages <= 1) {
        return (
            <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-600">Total: <span className="font-bold">{totalItems}</span> data</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <p className="text-sm text-gray-600">
                Halaman <span className="font-bold">{currentPage}</span> dari <span className="font-bold">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-white text-gray-700 text-sm font-bold w-8 h-8 rounded-md border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Halaman sebelumnya"
                >
                    &larr;
                </button>
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        className={`${
                            currentPage === number
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-gray-700 border hover:bg-gray-100'
                        } text-sm font-bold w-8 h-8 rounded-md border transition-colors`}
                    >
                        {number}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-white text-gray-700 text-sm font-bold w-8 h-8 rounded-md border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Halaman berikutnya"
                >
                    &rarr;
                </button>
            </div>
        </div>
    );
};

export default Pagination;