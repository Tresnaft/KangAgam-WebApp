import React from 'react';

// Komponen ini menerima 'title' dan 'children' sebagai props.
// 'children' akan merender apapun yang kita letakkan di antara <PageHeader>...</PageHeader>
const PageHeader = ({ title, children }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            {/* 'children' akan dirender di sini, di sebelah kanan judul */}
            <div className="mt-4 sm:mt-0">
                {children}
            </div>
        </div>
    );
};

export default PageHeader;