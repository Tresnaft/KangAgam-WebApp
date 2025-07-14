import React from 'react';

const PageHeader = ({ title, children }) => {
    return (
        // Tambahkan text-center dan sm:text-left untuk perataan responsif
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left mb-6 md:mb-8">
            {/* Tambahkan ukuran font responsif */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">{title}</h1>
            <div className="mt-4 sm:mt-0">
                {children}
            </div>
        </div>
    );
};

export default PageHeader;