import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/ui/Pagination';
import TopicFormModal from '../../components/admin/TopicFormModal';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import { getTopics, addTopic, updateTopic, deleteTopic } from '../../services/topicService';

const ITEMS_PER_PAGE = 5;

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

const ManageTopicsPage = () => {
    const [topicsData, setTopicsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [formModalState, setFormModalState] = useState({ isOpen: false, mode: 'add', data: null });
    const [deleteModalTopic, setDeleteModalTopic] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchTopics = async () => {
        try {
            setIsLoading(true);
            const data = await getTopics();
            setTopicsData(data.topics || []);
        } catch (err) {
            setError('Gagal memuat data topik.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const filteredTopics = topicsData.filter(topic =>
        (topic.topicName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredTopics.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTopics.length / ITEMS_PER_PAGE);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    
    const handleFormSubmit = async (formData) => {
        try {
            if (formModalState.mode === 'add') {
                await addTopic(formData);
                alert('Topik berhasil ditambahkan!');
            } else if (formModalState.mode === 'edit') {
                await updateTopic(formModalState.data._id, formData);
                alert('Topik berhasil diperbarui!');
            }
            fetchTopics();
        } catch (err) {
            alert(`Gagal ${formModalState.mode === 'add' ? 'menambahkan' : 'memperbarui'} topik.`);
        } finally {
            setFormModalState({ isOpen: false, mode: 'add', data: null });
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModalTopic) return;
        try {
            await deleteTopic(deleteModalTopic._id);
            alert('Topik berhasil dihapus!');
            fetchTopics();
        } catch (err) {
            alert('Gagal menghapus topik.');
        } finally {
            setDeleteModalTopic(null);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Daftar Topik</h1>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                        <input type="text" placeholder="Cari..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg"/>
                    </div>
                    <button onClick={() => setFormModalState({ isOpen: true, mode: 'add', data: null })} className="bg-green-500 text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-600 flex-shrink-0">
                        <PlusIcon />
                        <span>Tambah</span>
                    </button>
                </div>
            </div>

            {isLoading ? (
                <p>Memuat...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="hidden lg:flex flex-col bg-white rounded-xl shadow-md min-h-[480px]">
                    <div className="overflow-x-auto flex-grow">
                        <table className="w-full text-left table-fixed">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 font-bold text-gray-600 w-[5%]">#</th>
                                    <th className="p-4 font-bold text-gray-600 w-[40%]">Nama Topik</th>
                                    <th className="p-4 font-bold text-gray-600 w-[25%]">Total Kosakata</th>
                                    <th className="p-4 font-bold text-gray-600 text-center w-[30%]">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((topic, index) => (
                                    <tr key={topic._id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-4 text-gray-700">{indexOfFirstItem + index + 1}</td>
                                        <td className="p-4 text-gray-800 font-semibold truncate">{topic.topicName || 'Tanpa Nama'}</td>
                                        <td className="p-4 text-gray-700">{topic.topicEntries.length}</td>
                                        <td className="p-4 flex justify-center items-center gap-2">
                                            <button onClick={() => setFormModalState({ isOpen: true, mode: 'edit', data: topic })} className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-yellow-200">Edit</button>
                                            <button onClick={() => setDeleteModalTopic(topic)} className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-red-200">Delete</button>
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
            )}
            
            <TopicFormModal 
                isOpen={formModalState.isOpen}
                onClose={() => setFormModalState({ isOpen: false, mode: 'add', data: null })}
                onSubmit={handleFormSubmit}
                mode={formModalState.mode}
                initialData={formModalState.data}
            />
            <ConfirmDeleteModal
                isOpen={!!deleteModalTopic}
                onClose={() => setDeleteModalTopic(null)}
                onConfirm={handleDeleteConfirm}
                title="Hapus Topik"
                message={`Apakah Anda yakin ingin menghapus topik "${deleteModalTopic?.topicName}"?`}
            />
        </div>
    );
};

export default ManageTopicsPage;