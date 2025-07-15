import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TopicDetailModal from '../../components/admin/TopicDetailModal';
import Pagination from '../../components/ui/Pagination';

// --- DATA SIMULASI ---
const topicsData = [
    { id: 1, name: 'Abjad', totalWords: 300, lastUpdated: '7 Juli 2025 15:00', status: 'Published' },
    { id: 2, name: 'Angka', totalWords: 300, lastUpdated: '7 Juli 2025 15:00', status: 'Published' },
    { id: 3, name: 'Anggota Tubuh', totalWords: 300, lastUpdated: '7 Juli 2025 15:00', status: 'Published' },
    { id: 4, name: 'Warna', totalWords: 300, lastUpdated: '7 Juli 2025 15:00', status: 'Published' },
    { id: 5, name: 'Bentuk', totalWords: 300, lastUpdated: '7 Juli 2025 15:00', status: 'Draft' },
    { id: 6, name: 'Profesi', totalWords: 300, lastUpdated: '7 Juli 2025 15:00', status: 'Published' },
    { id: 7, name: 'Sayuran', totalWords: 150, lastUpdated: '8 Juli 2025 10:00', status: 'Published' },
];
// ------------------------------------

const ITEMS_PER_PAGE = 5;

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

const ManageTopicsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredTopics = topicsData.filter(topic =>
        topic.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredTopics.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTopics.length / ITEMS_PER_PAGE);

    const handleViewDetails = (topic) => { setSelectedTopic(topic); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setTimeout(() => setSelectedTopic(null), 300); };
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Daftar Topik</h1>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                        <input type="text" placeholder="Cari..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg"/>
                    </div>
                    <button className="bg-green-500 text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-600 flex-shrink-0"><PlusIcon /><span>Tambah</span></button>
                </div>
            </div>

            {/* Tampilan Tabel untuk Desktop */}
            <div className="hidden lg:flex flex-col bg-white rounded-xl shadow-md min-h-[480px]">
                <div className="overflow-x-auto flex-grow">
                    {/* 1. Tambahkan kelas 'table-fixed' */}
                    <table className="w-full text-left table-fixed">
                        <thead className="bg-gray-100">
                            <tr>
                                {/* 2. Berikan lebar spesifik untuk setiap kolom */}
                                <th className="p-4 font-bold text-gray-600 w-[5%]">#</th>
                                <th className="p-4 font-bold text-gray-600 w-[25%]">Nama Topik</th>
                                <th className="p-4 font-bold text-gray-600 w-[15%]">Total Kosakata</th>
                                <th className="p-4 font-bold text-gray-600 w-[25%]">Terakhir diupdate</th>
                                <th className="p-4 font-bold text-gray-600 w-[15%]">Status</th>
                                <th className="p-4 font-bold text-gray-600 text-center w-[15%]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((topic, index) => (
                                <tr key={topic.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-4 text-gray-700">{indexOfFirstItem + index + 1}</td>
                                    <td className="p-4 text-gray-800 font-semibold truncate">{topic.name}</td>
                                    <td className="p-4 text-gray-700">{topic.totalWords}</td>
                                    <td className="p-4 text-gray-700">{topic.lastUpdated}</td>
                                    <td className="p-4"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${topic.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{topic.status}</span></td>
                                    <td className="p-4 flex justify-center items-center gap-2">
                                        <button onClick={() => handleViewDetails(topic)} className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-gray-200">Lihat</button>
                                        <Link to={`/admin/manage-topics/${topic.name.toLowerCase()}`} className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-blue-200">Kosakata</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-200">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalItems={filteredTopics.length} />
                </div>
            </div>

            {/* Tampilan Daftar untuk Mobile */}
            <div className="lg:hidden bg-white rounded-xl shadow-md">
                <div className="min-h-[420px]">
                    {currentItems.map((topic) => (
                        <div key={topic.id} className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div>
                                <p className="font-bold text-gray-800">{topic.name}</p>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${topic.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{topic.status}</span>
                            </div>
                            <button onClick={() => handleViewDetails(topic)} className="bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-600">Detail</button>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalItems={filteredTopics.length} />
                </div>
            </div>

            {isModalOpen && <TopicDetailModal topic={selectedTopic} onClose={handleCloseModal} />}
        </div>
    );
};

export default ManageTopicsPage;