import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import Pagination from '../../components/ui/Pagination';
import WordFormModal from '../../components/admin/WordFormModal';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import ManageWordDetailModal from '../../components/admin/ManageWordDetailModal';
import ImageModal from '../../components/admin/ImageModal';
import AudioPlayerModal from '../../components/admin/AudioPlayerModal';
import { getEntriesByTopicId, addEntry, updateEntry, deleteEntry } from '../../services/entryService';
import { getTopicById } from '../../services/topicService';
import { useAuth } from '../../context/AuthContext';
import LoadingIndicator from '../../components/ui/LoadingIndicator';

const ITEMS_PER_PAGE = 7;

// Icon Components
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

const ManageWordsPage = () => {
    const { user } = useAuth();
    const { topicId } = useParams();
    const [topicName, setTopicName] = useState('');
    const [wordsData, setWordsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [imageModalUrl, setImageModalUrl] = useState(null);
    const [audioModalEntry, setAudioModalEntry] = useState(null);
    const [formModalState, setFormModalState] = useState({ isOpen: false, mode: 'add', data: null });
    const [deleteModalWord, setDeleteModalWord] = useState(null);
    const [detailModalWord, setDetailModalWord] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
            const topicInfoFetch = getTopicById(topicId);
            const entriesDataFetch = getEntriesByTopicId(topicId);
            const [topicInfo, entriesData] = await Promise.all([topicInfoFetch, entriesDataFetch, minDelay]);
            const mainTopicName = topicInfo.topic.topicName.find(t => t.lang === 'id')?.value || 'Topik';
            setTopicName(mainTopicName);
            setWordsData(entriesData.entries || []);
            setError(null);
        } catch (err) {
            setError("Gagal memuat data kosakata.");
        } finally {
            setIsLoading(false);
        }
    }, [topicId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const findVocab = (entry, lang) => {
        if (!entry || !entry.entryVocabularies) return 'N/A';
        const vocab = entry.entryVocabularies.find(v => v.language.languageCode === lang);
        return vocab ? vocab.vocab : 'N/A';
    };

    const filteredWords = wordsData.filter(entry =>
        findVocab(entry, 'id').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredWords.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredWords.length / ITEMS_PER_PAGE);
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleFormSubmit = async (formData) => {
        const token = user?.token;
        if (!token) {
            alert("Otentikasi gagal. Silakan login kembali.");
            return;
        }
        try {
            if (formModalState.mode === 'add') {
                await addEntry(topicId, formData, token);
                alert('Kosakata berhasil ditambahkan!');
            } else if (formModalState.mode === 'edit') {
                await updateEntry(topicId, formModalState.data._id, formData, token);
                alert('Kosakata berhasil diperbarui!');
            }
            fetchData();
        } catch (err) {
            alert(`Gagal ${formModalState.mode === 'add' ? 'menambahkan' : 'memperbarui'} kosakata.`);
        } finally {
            setFormModalState({ isOpen: false, mode: 'add', data: null });
            setDetailModalWord(null);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModalWord) return;
        const token = user?.token;
        if (!token) {
            alert("Otentikasi gagal. Silakan login kembali.");
            return;
        }
        try {
            await deleteEntry(topicId, deleteModalWord._id, token);
            alert('Kosakata berhasil dihapus!');
            fetchData();
        } catch (err) {
            alert('Gagal menghapus kosakata.');
        } finally {
            setDeleteModalWord(null);
            setDetailModalWord(null);
        }
    };

    const emptyRowsCount = Math.max(0, ITEMS_PER_PAGE - currentItems.length);
    const emptyRows = Array(emptyRowsCount).fill(null);

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                <div>
                    <nav className="text-sm text-text-secondary mb-1">
                        <Link to="/admin/manage-topics" className="hover:underline">Daftar Topik</Link>
                        <span className="mx-2">&gt;</span>
                        <span className="font-semibold text-text">{topicName}</span>
                    </nav>
                    <h1 className="text-2xl sm:text-3xl font-bold text-text">Kosakata Topik {topicName}</h1>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto sm:flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                        <input 
                            type="text" 
                            placeholder="Cari kosakata..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-background-secondary text-text"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Link 
                            to="/admin/manage-topics" 
                            className="bg-background-secondary text-text-secondary font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 flex-grow sm:flex-grow-0 justify-center text-sm border border-gray-300 dark:border-gray-600"
                        >
                            <span>Kembali</span>
                        </Link>
                        <Link 
                            to={`/topik/${topicId}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-gray-500/10 text-text-secondary font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-500/20 flex-grow sm:flex-grow-0 justify-center text-sm"
                        >
                            <span>Pratinjau</span>
                        </Link>
                        <button 
                            onClick={() => setFormModalState({ isOpen: true, mode: 'add', data: null })} 
                            className="bg-primary text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 flex-grow sm:flex-grow-0 justify-center text-sm"
                        >
                            <PlusIcon />
                            <span>Tambah</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-background-secondary rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        {/* ✅ PERBAIKAN: Mengganti warna header tabel */}
                        <thead className="bg-slate-50 dark:bg-gray-700/50">
                            <tr style={{ height: '60px' }}>
                                <th className="hidden sm:table-cell p-3 px-6 font-bold text-text-secondary w-[5%]">No.</th>
                                <th className="p-3 px-6 font-bold text-text-secondary">Indonesia</th>
                                <th className="hidden sm:table-cell p-3 px-6 font-bold text-text-secondary w-[20%]">Sunda</th>
                                <th className="hidden sm:table-cell p-3 px-6 font-bold text-text-secondary w-[20%]">Inggris</th>
                                <th className="p-3 px-6 font-bold text-text-secondary text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr style={{ height: `${ITEMS_PER_PAGE * 60}px` }}><td colSpan="5" className="text-center align-middle"><LoadingIndicator /></td></tr>
                            ) : error ? (
                                <tr style={{ height: `${ITEMS_PER_PAGE * 60}px` }}><td colSpan="5" className="text-center align-middle text-red-500">{error}</td></tr>
                            ) : filteredWords.length === 0 ? (
                                <tr style={{ height: `${ITEMS_PER_PAGE * 60}px` }}>
                                    <td colSpan="5" className="text-center align-middle text-text-secondary">Belum ada kosakata di topik ini.</td>
                                </tr>
                            ) : (
                                <>
                                    {currentItems.map((entry, index) => (
                                        <tr key={entry._id} className="border-b border-background hover:bg-background/50" style={{ height: '60px' }}>
                                            <td className="hidden sm:table-cell p-3 px-6 text-text-secondary">{indexOfFirstItem + index + 1}</td>
                                            <td className="p-3 px-6 text-text font-semibold truncate">{findVocab(entry, 'id')}</td>
                                            <td className="hidden sm:table-cell p-3 px-6 text-text-secondary truncate">{findVocab(entry, 'su')}</td>
                                            <td className="hidden sm:table-cell p-3 px-6 text-text-secondary truncate">{findVocab(entry, 'en')}</td>
                                            <td className="p-3 px-6 text-right">
                                                <div className="hidden sm:flex justify-end items-center gap-2">
                                                    <button onClick={() => setImageModalUrl(`http://localhost:5000${entry.entryImagePath}`)} className="bg-gray-500/10 text-text-secondary text-xs font-bold px-3 py-1.5 rounded-md hover:bg-gray-500/20">Gambar</button>
                                                    <button onClick={() => setAudioModalEntry(entry)} className="bg-gray-500/10 text-text-secondary text-xs font-bold px-3 py-1.5 rounded-md hover:bg-gray-500/20">Audio</button>
                                                    <button onClick={() => setFormModalState({ isOpen: true, mode: 'edit', data: entry })} className="bg-yellow-500/10 text-yellow-600 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-yellow-500/20">Edit</button>
                                                    <button onClick={() => setDeleteModalWord(entry)} className="bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-red-500/20">Delete</button>
                                                </div>
                                                <div className="sm:hidden">
                                                    <button onClick={() => setDetailModalWord(entry)} className="bg-background text-text-secondary text-xs font-bold px-3 py-1.5 rounded-md hover:bg-background/80">Detail</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {currentItems.length > 0 && emptyRows.map((_, index) => (
                                        <tr key={`empty-${index}`} className="border-b border-background" style={{ height: '60px' }}><td colSpan="5"></td></tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-4 border-t border-background">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalItems={filteredWords.length} />
                </div>
            </div>

            <ImageModal imageUrl={imageModalUrl} onClose={() => setImageModalUrl(null)} />
            <AudioPlayerModal entry={audioModalEntry} onClose={() => setAudioModalEntry(null)} />
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
                message={deleteModalWord ? `Apakah Anda yakin ingin menghapus kosakata "${findVocab(deleteModalWord, 'id')}"?` : ''}
            />
            <ManageWordDetailModal
                word={detailModalWord}
                onClose={() => setDetailModalWord(null)}
                onEdit={() => setFormModalState({ isOpen: true, mode: 'edit', data: detailModalWord })}
                onDelete={() => setDeleteModalWord(detailModalWord)}
                onViewImage={() => setImageModalUrl(`http://localhost:5000${detailModalWord.entryImagePath}`)}
                onPlayAudio={() => setAudioModalEntry(detailModalWord)}
                findVocab={findVocab}
            />
        </div>
    );
};

export default ManageWordsPage;