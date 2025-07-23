import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import Pagination from '../../components/ui/Pagination';
import WordFormModal from '../../components/admin/WordFormModal';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import ImageModal from '../../components/admin/ImageModal';
import AudioPlayerModal from '../../components/admin/AudioPlayerModal';
import { getEntriesByTopicId, addEntry, updateEntry, deleteEntry } from '../../services/entryService';
import { getTopicById } from '../../services/topicService';
import { useAuth } from '../../context/AuthContext';
import LoadingIndicator from '../../components/ui/LoadingIndicator';

const ITEMS_PER_PAGE = 5;

// Komponen Ikon
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
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

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            
            // --- PERBAIKAN DI SINI ---
            const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
            const topicInfoFetch = getTopicById(topicId);
            const entriesDataFetch = getEntriesByTopicId(topicId);

            const [topicInfo, entriesData] = await Promise.all([
                topicInfoFetch,
                entriesDataFetch,
                minDelay
            ]);
            
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
        }
    };

    return (
        <div>
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

            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 font-bold text-gray-600 w-[5%]">#</th>
                            <th className="p-4 font-bold text-gray-600 w-[18%]">Indonesia</th>
                            <th className="p-4 font-bold text-gray-600 w-[18%]">Sunda</th>
                            <th className="p-4 font-bold text-gray-600 w-[18%]">Inggris</th>
                            <th className="p-4 font-bold text-gray-600 w-[12%]">Gambar</th>
                            <th className="p-4 font-bold text-gray-600 w-[12%]">Audio</th>
                            <th className="p-4 font-bold text-gray-600 text-center w-[17%]">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="text-center p-8"><LoadingIndicator /></td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="7" className="text-center p-8 text-red-500">{error}</td>
                            </tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((entry, index) => (
                                <tr key={entry._id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-4 text-gray-700">{indexOfFirstItem + index + 1}</td>
                                    <td className="p-4 text-gray-800 font-semibold truncate">{findVocab(entry, 'id')}</td>
                                    <td className="p-4 text-gray-800 truncate">{findVocab(entry, 'su')}</td>
                                    <td className="p-4 text-gray-800 truncate">{findVocab(entry, 'en')}</td>
                                    <td className="p-4">
                                        <button onClick={() => setImageModalUrl(`http://localhost:5000${entry.entryImagePath}`)} className="text-blue-600 hover:underline text-sm">Lihat Gambar</button>
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => setAudioModalEntry(entry)} className="text-blue-600 hover:underline text-sm">Putar Audio</button>
                                    </td>
                                    <td className="p-4 flex justify-center items-center gap-2">
                                        <button onClick={() => setFormModalState({ isOpen: true, mode: 'edit', data: entry })} className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-yellow-200">Edit</button>
                                        <button onClick={() => setDeleteModalWord(entry)} className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-red-200">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                             <tr>
                                <td colSpan="7" className="text-center p-8 text-gray-500">Belum ada kosakata di topik ini.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                 <div className="p-4 border-t border-gray-200">
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
                message={`Apakah Anda yakin ingin menghapus kosakata "${findVocab(deleteModalWord, 'id')}"?`}
            />
        </div>
    );
};

export default ManageWordsPage;