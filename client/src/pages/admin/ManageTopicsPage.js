import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/ui/Pagination';
import TopicFormModal from '../../components/admin/TopicFormModal';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import ManageTopicDetailModal from '../../components/admin/ManageTopicDetailModal';
import { getTopics, addTopic, updateTopic, deleteTopic } from '../../services/topicService';
import { useAuth } from '../../context/AuthContext';
import LoadingIndicator from '../../components/ui/LoadingIndicator';

const ITEMS_PER_PAGE = 8;

// Icon Components
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

const ManageTopicsPage = () => {
    const { user } = useAuth();
    const [topicsData, setTopicsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [formModalState, setFormModalState] = useState({ isOpen: false, mode: 'add', data: null });
    const [deleteModalTopic, setDeleteModalTopic] = useState(null);
    const [detailModalTopic, setDetailModalTopic] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchTopics = async () => {
        try {
            setIsLoading(true);
            const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
            const dataFetch = getTopics();
            const [data] = await Promise.all([dataFetch, minDelay]);
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
        const token = user?.token;
        if (!token) {
            alert("Otentikasi gagal. Silakan login kembali.");
            return;
        }
        try {
            if (formModalState.mode === 'add') {
                await addTopic(formData, token);
                alert('Topik berhasil ditambahkan!');
            } else if (formModalState.mode === 'edit') {
                await updateTopic(formModalState.data._id, formData, token);
                alert('Topik berhasil diperbarui!');
            }
            fetchTopics();
        } catch (err) {
            alert(`Gagal ${formModalState.mode === 'add' ? 'menambahkan' : 'memperbarui'} topik.`);
        } finally {
            setFormModalState({ isOpen: false, mode: 'add', data: null });
            setDetailModalTopic(null);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModalTopic) return;
        const token = user?.token;
        if (!token) {
            alert("Otentikasi gagal. Silakan login kembali.");
            return;
        }
        try {
            await deleteTopic(deleteModalTopic._id, token);
            alert('Topik berhasil dihapus!');
            fetchTopics();
        } catch (err) {
            alert('Gagal menghapus topik.');
        } finally {
            setDeleteModalTopic(null);
            setDetailModalTopic(null);
        }
    };

    const emptyRowsCount = Math.max(0, ITEMS_PER_PAGE - currentItems.length);
    const emptyRows = Array(emptyRowsCount).fill(null);

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-text">Daftar Topik</h1>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                        <input 
                            type="text" 
                            placeholder="Cari..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-background-secondary text-text"
                        />
                    </div>
                    <button 
                        onClick={() => setFormModalState({ isOpen: true, mode: 'add', data: null })} 
                        className="bg-primary text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 flex-shrink-0 text-sm"
                    >
                        <PlusIcon />
                        <span>Tambah</span>
                    </button>
                </div>
            </div>

            <div className="bg-background-secondary rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        {/* ✅ PERBAIKAN: Mengganti warna header tabel */}
                        <thead className="bg-slate-50 dark:bg-gray-700/50">
                            <tr style={{ height: '60px' }}>
                                <th className="hidden sm:table-cell p-3 px-6 font-bold text-text-secondary w-[5%]">No.</th>
                                <th className="p-3 px-6 font-bold text-text-secondary">Nama Topik</th>
                                <th className="hidden sm:table-cell p-3 px-6 font-bold text-text-secondary w-[20%]">Total Kosakata</th>
                                <th className="p-3 px-6 font-bold text-text-secondary text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr style={{ height: `${ITEMS_PER_PAGE * 60}px` }}>
                                    <td colSpan="4" className="text-center align-middle"><LoadingIndicator /></td>
                                </tr>
                            ) : error ? (
                                <tr style={{ height: `${ITEMS_PER_PAGE * 60}px` }}>
                                    <td colSpan="4" className="text-center align-middle text-red-500">{error}</td>
                                </tr>
                            ) : (
                                <>
                                    {currentItems.map((topic, index) => (
                                        <tr key={topic._id} className="border-b border-background hover:bg-background/50" style={{ height: '60px' }}>
                                            <td className="hidden sm:table-cell p-3 px-6 text-text-secondary">{indexOfFirstItem + index + 1}</td>
                                            <td className="p-3 px-6 text-text font-semibold truncate">{topic.topicName || 'Tanpa Nama'}</td>
                                            <td className="hidden sm:table-cell p-3 px-6 text-text-secondary">{topic.topicEntries.length}</td>
                                            <td className="p-3 px-6 text-right">
                                                <div className="hidden sm:flex justify-end items-center gap-2">
                                                    <Link to={`/topik/${topic._id}`} target="_blank" rel="noopener noreferrer" className="bg-gray-500/10 text-text-secondary text-xs font-bold px-3 py-1.5 rounded-md hover:bg-gray-500/20">Pratinjau</Link>
                                                    <Link to={`/admin/manage-topics/${topic._id}`} className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded-md hover:bg-primary/20">Kosakata</Link>
                                                    <button onClick={() => setFormModalState({ isOpen: true, mode: 'edit', data: topic })} className="bg-yellow-500/10 text-yellow-600 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-yellow-500/20">Edit</button>
                                                    <button onClick={() => setDeleteModalTopic(topic)} className="bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-red-500/20">Delete</button>
                                                </div>
                                                <div className="sm:hidden">
                                                    <button onClick={() => setDetailModalTopic(topic)} className="bg-background text-text-secondary text-xs font-bold px-3 py-1.5 rounded-md hover:bg-background/80">
                                                        Detail
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {emptyRows.map((_, index) => (
                                        <tr key={`empty-${index}`} className="border-b border-background" style={{ height: '60px' }}>
                                            <td colSpan="4"></td>
                                        </tr>
                                    ))}
                                    {currentItems.length === 0 && (
                                        <tr style={{ height: `${ITEMS_PER_PAGE * 60}px` }}>
                                            <td colSpan="4" className="text-center align-middle text-text-secondary">Tidak ada topik yang ditemukan.</td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-4 border-t border-background">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalItems={filteredTopics.length} />
                </div>
            </div>
            
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
            <ManageTopicDetailModal
                topic={detailModalTopic}
                onClose={() => setDetailModalTopic(null)}
                onEdit={() => setFormModalState({ isOpen: true, mode: 'edit', data: detailModalTopic })}
                onDelete={() => setDeleteModalTopic(detailModalTopic)}
            />
        </div>
    );
};

export default ManageTopicsPage;