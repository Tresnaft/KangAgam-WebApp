import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import learnerService from '../../services/learnerService';
import PageHeader from '../../components/ui/PageHeader';
import Pagination from '../../components/ui/Pagination';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import LoadingIndicator from '../../components/ui/LoadingIndicator';
import ManageLearnerDetailModal from '../../components/admin/ManageLearnerDetailModal'; // 1. Import modal detail

const ITEMS_PER_PAGE = 10;

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

const ManageLearnersPage = () => {
    const { user } = useAuth();
    const [learners, setLearners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [learnerToDelete, setLearnerToDelete] = useState(null);
    const [detailModalLearner, setDetailModalLearner] = useState(null); // 2. State untuk modal detail

    const fetchLearners = useCallback(async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
            const dataFetch = learnerService.getAllLearners(user.token);
            const [response] = await Promise.all([dataFetch, minDelay]);
            setLearners(response.data || []);
            setError(null);
        } catch (err) {
            setError('Gagal memuat data pengguna.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchLearners();
    }, [fetchLearners]);

    const handleDeleteConfirm = async () => {
        if (!learnerToDelete || !user?.token) return;
        try {
            await learnerService.deleteLearner(learnerToDelete._id, user.token);
            alert('Pengguna berhasil dihapus.');
            fetchLearners();
        } catch (err) {
            alert('Gagal menghapus pengguna.');
            console.error(err);
        } finally {
            setLearnerToDelete(null);
            setDetailModalLearner(null); // Tutup juga modal detail
        }
    };

    const filteredLearners = learners.filter(learner =>
        learner.learnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (learner.learnerCity && learner.learnerCity.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredLearners.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredLearners.length / ITEMS_PER_PAGE);

    return (
        <div>
            <PageHeader title="Daftar Pengguna" />

            <div className="mb-6">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama atau domisili..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 w-full max-w-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-background-secondary text-text"
                    />
                </div>
            </div>

            <div className="bg-background-secondary rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="hidden sm:table-cell p-3 px-6 font-bold text-text-secondary w-[5%]">#</th>
                            <th className="p-3 px-6 font-bold text-text-secondary">Nama Lengkap</th>
                            <th className="hidden sm:table-cell p-3 px-6 font-bold text-text-secondary w-[25%]">Domisili</th>
                            <th className="hidden sm:table-cell p-3 px-6 font-bold text-text-secondary w-[20%]">No. Telepon</th>
                            <th className="p-3 px-6 font-bold text-text-secondary text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="5" className="text-center p-8"><LoadingIndicator /></td></tr>
                        ) : error ? (
                            <tr><td colSpan="5" className="text-center p-8 text-red-500">{error}</td></tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((learner, index) => (
                                <tr key={learner._id} className="border-b border-background hover:bg-background">
                                    <td className="hidden sm:table-cell p-3 px-6 text-text-secondary">{indexOfFirstItem + index + 1}</td>
                                    <td className="p-3 px-6 text-text font-semibold">{learner.learnerName}</td>
                                    <td className="hidden sm:table-cell p-3 px-6 text-text-secondary">{learner.learnerCity}</td>
                                    <td className="hidden sm:table-cell p-3 px-6 text-text-secondary">{learner.learnerPhone || '-'}</td>
                                    <td className="p-3 px-6 text-right">
                                        <div className="hidden sm:flex justify-end">
                                            <button onClick={() => setLearnerToDelete(learner)} className="bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-red-500/20">Hapus</button>
                                        </div>
                                        <div className="sm:hidden">
                                            <button onClick={() => setDetailModalLearner(learner)} className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-gray-200">
                                                Detail
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center p-8 text-gray-500">Tidak ada pengguna yang ditemukan.</td></tr>
                        )}
                    </tbody>
                </table>
                <div className="p-4 border-t border-background">
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={(page) => setCurrentPage(page)} 
                        totalItems={filteredLearners.length} 
                    />
                </div>
            </div>

            <ConfirmDeleteModal
                isOpen={!!learnerToDelete}
                onClose={() => setLearnerToDelete(null)}
                onConfirm={handleDeleteConfirm}
                title="Hapus Pengguna"
                message={`Apakah Anda yakin ingin menghapus pengguna "${learnerToDelete?.learnerName}"? Aksi ini tidak dapat dibatalkan.`}
            />
            {/* 3. Render modal detail baru */}
            <ManageLearnerDetailModal
                learner={detailModalLearner}
                onClose={() => setDetailModalLearner(null)}
                onDelete={() => setLearnerToDelete(detailModalLearner)}
            />
        </div>
    );
};

export default ManageLearnersPage;