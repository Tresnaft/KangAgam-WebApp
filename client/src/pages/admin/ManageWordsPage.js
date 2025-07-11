import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

// --- DATA SIMULASI KOSAKATA ---
// Kunci objek (misal: 'angka') harus cocok dengan slug dari halaman sebelumnya
const MOCK_WORDS_DATA = {
    'abjad': [
        { id: 1, indonesia: 'A', sunda: 'A', inggris: 'A' },
        { id: 2, indonesia: 'B', sunda: 'B', inggris: 'B' },
    ],
    'angka': [
        { id: 1, indonesia: 'Satu', sunda: 'Hiji', inggris: 'One' },
        { id: 2, indonesia: 'Dua', sunda: 'Dua', inggris: 'Two' },
        { id: 3, indonesia: 'Tiga', sunda: 'Tilu', inggris: 'Three' },
        { id: 4, indonesia: 'Empat', sunda: 'Opat', inggris: 'Four' },
        { id: 5, indonesia: 'Lima', sunda: 'Lima', inggris: 'Five' },
    ]
};
// -----------------------------

// Komponen Ikon sederhana
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

const ManageWordsPage = () => {
    const { topicId } = useParams(); // Mengambil ID topik dari URL, misal: "angka"
    const [searchTerm, setSearchTerm] = useState('');

    const topicName = topicId.charAt(0).toUpperCase() + topicId.slice(1);
    const wordsData = MOCK_WORDS_DATA[topicId] || [];

    // Logika untuk memfilter data berdasarkan pencarian
    const filteredWords = wordsData.filter(word =>
        word.indonesia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.sunda.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.inggris.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Breadcrumb dan Header Halaman */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <nav className="text-sm text-gray-500 mb-2">
                        <Link to="/admin/manage-topics" className="hover:underline">Daftar Topik</Link>
                        <span className="mx-2">&gt;</span>
                        <span className="font-semibold text-gray-700">{topicName}</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-gray-800">Kosakata Topik {topicName}</h1>
                </div>
                
                {/* Grup Search dan Tombol Tambah */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon />
                        </span>
                        <input 
                            type="text"
                            placeholder="Cari kosakata..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                        />
                    </div>
                    <button className="bg-green-500 text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-600">
                        <PlusIcon />
                        <span>Tambah</span>
                    </button>
                </div>
            </div>

            {/* Kontainer Tabel */}
            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 font-bold text-gray-600">#</th>
                            <th className="p-4 font-bold text-gray-600">Indonesia</th>
                            <th className="p-4 font-bold text-gray-600">Sunda</th>
                            <th className="p-4 font-bold text-gray-600">Inggris</th>
                            <th className="p-4 font-bold text-gray-600">Gambar</th>
                            <th className="p-4 font-bold text-gray-600">Audio</th>
                            <th className="p-4 font-bold text-gray-600 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWords.map((word, index) => (
                            <tr key={word.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-4 text-gray-700">{index + 1}</td>
                                <td className="p-4 text-gray-800 font-semibold">{word.indonesia}</td>
                                <td className="p-4 text-gray-800 font-semibold">{word.sunda}</td>
                                <td className="p-4 text-gray-800 font-semibold">{word.inggris}</td>
                                <td className="p-4">
                                    <button className="text-blue-600 hover:underline text-sm">Lihat Gambar</button>
                                </td>
                                <td className="p-4">
                                    <button className="text-blue-600 hover:underline text-sm">Putar Audio</button>
                                </td>
                                <td className="p-4 flex justify-center items-center gap-2">
                                    <button className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-yellow-200">Edit</button>
                                    <button className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-red-200">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Tabel & Paginasi */}
            <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-600">Total Kosakata: {filteredWords.length}</p>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Page</span>
                    <button className="bg-blue-500 text-white text-sm font-bold w-8 h-8 rounded-md">1</button>
                    <button className="bg-white text-gray-700 text-sm font-bold w-8 h-8 rounded-md border hover:bg-gray-100">2</button>
                </div>
            </div>
        </div>
    );
};

export default ManageWordsPage;