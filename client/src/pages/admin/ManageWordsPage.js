import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import WordDetailModal from '../../components/admin/WordDetailModal';
import Pagination from '../../components/ui/Pagination';
import WordFormModal from '../../components/admin/WordFormModal';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';

// --- DATA SIMULASI KOSAKATA ---
const initialWordsData = [
    { id: 1, indonesia: 'A', sunda: 'A', inggris: 'A' }, { id: 2, indonesia: 'B', sunda: 'B', inggris: 'B' },
    { id: 3, indonesia: 'C', sunda: 'C', inggris: 'C' }, { id: 4, indonesia: 'D', sunda: 'D', inggris: 'D' },
    { id: 5, indonesia: 'E', sunda: 'E', inggris: 'E' }, { id: 6, indonesia: 'F', sunda: 'F', inggris: 'F' },
    { id: 7, indonesia: 'G', sunda: 'G', inggris: 'G' },
];
// -----------------------------

const ITEMS_PER_PAGE = 5;

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

const ManageWordsPage = () => {
    const { topicId } = useParams();
    const [wordsData, setWordsData] = useState(initialWordsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // 1. Gunakan state terpisah untuk setiap modal
    const [detailModalWord, setDetailModalWord] = useState(null);
    const [formModalState, setFormModalState] = useState({ isOpen: false, mode: 'add', data: null });
    const [deleteModalWord, setDeleteModalWord] = useState(null);

    const topicName = topicId.charAt(0).toUpperCase() + topicId.slice(1);

    const filteredWords = wordsData.filter(word =>
        word.indonesia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.sunda.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.inggris.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredWords.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredWords.length / ITEMS_PER_PAGE);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    // --- Fungsi-fungsi untuk mengelola modal ---
    const handleFormSubmit = (formData) => {
        if (formModalState.mode === 'add') {
            const newWord = { id: Date.now(), ...formData };
            setWordsData(prev => [newWord, ...prev]);
        } else if (formModalState.mode === 'edit') {
            setWordsData(prev => prev.map(word => 
                word.id === formModalState.data.id ? { ...word, ...formData } : word
            ));
        }
        setFormModalState({ isOpen: false, mode: 'add', data: null });
        setDetailModalWord(null);
    };

    const handleDeleteConfirm = () => {
        setWordsData(prev => prev.filter(word => word.id !== deleteModalWord.id));
        setDeleteModalWord(null);
        setDetailModalWord(null);
    };

    return (
        <div>
            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <nav className="text-sm text-gray-500 mb-1">
                        <Link to="/admin/manage-topics" className="hover:underline">Daftar Topik</Link>
                        <span className="mx-2">&gt;</span>
                        <span className="font-semibold text-gray-700">{topicName}</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-gray-800">Kosakata Topik {topicName}</h1>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                        <input type="text" placeholder="Cari kosakata..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg"/>
                    </div>
                    <button onClick={() => setFormModalState({ isOpen: true, mode: 'add', data: null })} className="bg-green-500 text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-600 flex-shrink-0">
                        <PlusIcon />
                        <span>Tambah</span>
                    </button>
                </div>
            </div>

            {/* Tampilan Tabel untuk Desktop */}
            <div className="hidden lg:flex flex-col bg-white rounded-xl shadow-md min-h-[480px]">
                <div className="overflow-x-auto flex-grow">
                    <table className="w-full text-left table-fixed">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 font-bold text-gray-600 w-[5%]">#</th><th className="p-4 font-bold text-gray-600 w-[18%]">Indonesia</th>
                                <th className="p-4 font-bold text-gray-600 w-[18%]">Sunda</th><th className="p-4 font-bold text-gray-600 w-[18%]">Inggris</th>
                                <th className="p-4 font-bold text-gray-600 w-[12%]">Gambar</th><th className="p-4 font-bold text-gray-600 w-[12%]">Audio</th>
                                <th className="p-4 font-bold text-gray-600 text-center w-[17%]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((word, index) => (
                                <tr key={word.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-4 text-gray-700">{indexOfFirstItem + index + 1}</td>
                                    <td className="p-4 text-gray-800 font-semibold truncate">{word.indonesia}</td>
                                    <td className="p-4 text-gray-800 truncate">{word.sunda}</td><td className="p-4 text-gray-800 truncate">{word.inggris}</td>
                                    <td className="p-4"><button className="text-blue-600 hover:underline text-sm">Lihat Gambar</button></td>
                                    <td className="p-4"><button className="text-blue-600 hover:underline text-sm">Putar Audio</button></td>
                                    <td className="p-4 flex justify-center items-center gap-2">
                                        <button onClick={() => setFormModalState({ isOpen: true, mode: 'edit', data: word })} className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-yellow-200">Edit</button>
                                        <button onClick={() => setDeleteModalWord(word)} className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-red-200">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-200">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalItems={filteredWords.length} />
                </div>
            </div>

            {/* Tampilan Daftar untuk Mobile */}
            <div className="lg:hidden bg-white rounded-xl shadow-md">
                <div className="min-h-[420px]">
                    {currentItems.map((word) => (
                        <div key={word.id} className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div>
                                <p className="font-bold text-gray-800">{word.indonesia}</p>
                                <p className="text-sm text-gray-500">{word.sunda} / {word.inggris}</p>
                            </div>
                            <button onClick={() => setDetailModalWord(word)} className="bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-600">
                                Detail
                            </button>
                        </div>
                    ))}
                </div>
                 <div className="p-4 border-t">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalItems={filteredWords.length} />
                </div>
            </div>

            {/* 2. Render semua modal dengan state masing-masing */}
            <WordDetailModal 
                word={detailModalWord} 
                onClose={() => setDetailModalWord(null)}
                onEdit={() => setFormModalState({ isOpen: true, mode: 'edit', data: detailModalWord })}
                onDelete={() => setDeleteModalWord(detailModalWord)}
            />
            <WordFormModal
                isOpen={formModalState.isOpen}
                onClose={() => setFormModalState({ isOpen: false, mode: 'add', data: null })}
                onSubmit={handleFormSubmit}
                mode={formModalState.mode}
                initialData={formModalState.data}
            />
            <ConfirmDeleteModal
                isOpen={!!deleteModalWord}
                onClose={() => setDeleteModalWord(null)}
                onConfirm={handleDeleteConfirm}
                title="Hapus Kosakata"
                message={`Apakah Anda yakin ingin menghapus kosakata "${deleteModalWord?.indonesia}"?`}
            />
        </div>
    );
};

export default ManageWordsPage;