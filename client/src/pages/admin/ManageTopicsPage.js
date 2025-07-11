import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- DATA SIMULASI (DUMMY DATA) ---
const topicsData = [
    { id: 1, name: 'Abjad', totalWords: 300, lastUpdated: '7 Juli 2025 15:00', status: 'Published' },
    { id: 2, name: 'Angka', totalWords: 300, lastUpdated: '7 Juli 2025 15:00', status: 'Published' },
    { id: 3, name: 'Anggota Tubuh', totalWords: 300, lastUpdated: '7 Juli 2025 15:00', status: 'Published' },
    { id: 4, name: 'Warna', totalWords: 300, lastUpdated: '7 Juli 2025 15:00', status: 'Published' },
    { id: 5, name: 'Bentuk', totalWords: 300, lastUpdated: '7 Juli 2025 15:00', status: 'Draft' },
    { id: 6, name: 'Profesi', totalWords: 300, lastUpdated: '7 Juli 2025 15:00', status: 'Published' },
];
// ------------------------------------

// Komponen Ikon sederhana
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

const ManageTopicsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Logika untuk memfilter data berdasarkan pencarian
    const filteredTopics = topicsData.filter(topic =>
        topic.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Header Halaman */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Daftar Topik</h1>
                
                {/* Grup Search dan Tombol Tambah */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon />
                        </span>
                        <input 
                            type="text"
                            placeholder="Cari..."
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
                    {/* Header Tabel */}
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 font-bold text-gray-600">#</th>
                            <th className="p-4 font-bold text-gray-600">Nama Topik</th>
                            <th className="p-4 font-bold text-gray-600">Total Kosakata</th>
                            <th className="p-4 font-bold text-gray-600">Terakhir diupdate</th>
                            <th className="p-4 font-bold text-gray-600">Status</th>
                            <th className="p-4 font-bold text-gray-600 text-center">Action</th>
                        </tr>
                    </thead>
                    {/* Isi Tabel */}
                    <tbody>
                        {filteredTopics.map((topic, index) => (
                            <tr key={topic.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="p-4 text-gray-700">{index + 1}</td>
                                <td className="p-4 text-gray-800 font-semibold">{topic.name}</td>
                                <td className="p-4 text-gray-700">{topic.totalWords}</td>
                                <td className="p-4 text-gray-700">{topic.lastUpdated}</td>
                                <td className="p-4">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                        topic.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {topic.status}
                                    </span>
                                </td>
                                <td className="p-4 flex justify-center items-center gap-2">
                                    <Link 
                                        to={`/admin/manage-topics/${topic.name.toLowerCase()}`}
                                        className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-blue-200"
                                    >
                                        Lihat Kosakata
                                    </Link>
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
                <p className="text-sm text-gray-600">Total Topik: {filteredTopics.length}</p>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Page</span>
                    <button className="bg-blue-500 text-white text-sm font-bold w-8 h-8 rounded-md">1</button>
                    <button className="bg-white text-gray-700 text-sm font-bold w-8 h-8 rounded-md border hover:bg-gray-100">2</button>
                    <button className="bg-white text-gray-700 text-sm font-bold w-8 h-8 rounded-md border hover:bg-gray-100">3</button>
                    <button className="bg-white text-gray-700 text-sm font-bold w-8 h-8 rounded-md border hover:bg-gray-100">4</button>
                </div>
            </div>
        </div>
    );
};

export default ManageTopicsPage;