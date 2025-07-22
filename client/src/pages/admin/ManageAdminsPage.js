import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import settingService from '../../services/settingService';
import PageHeader from '../../components/ui/PageHeader';
import Pagination from '../../components/ui/Pagination';
import AdminFormModal from '../../components/admin/AdminFormModal';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import LoadingIndicator from '../../components/ui/LoadingIndicator';
import AdminLimitSettings from '../../components/admin/AdminLimitSettings';

const ITEMS_PER_PAGE = 5;

// Komponen Ikon
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

const ManageAdminsPage = () => {
    const { user } = useAuth();
    const [adminsData, setAdminsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalState, setModalState] = useState({ type: null, mode: null, data: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [settings, setSettings] = useState({ maxAdmins: 5 });

    // Menggabungkan fetch admin dan settings
    const fetchData = useCallback(async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            const [adminResponse, settingsResponse] = await Promise.all([
                adminService.getAllAdmins(user.token),
                settingService.getSettings(user.token)
            ]);
            setAdminsData(adminResponse.data || []);
            setSettings(settingsResponse || { maxAdmins: 5 });
            setError(null);
        } catch (err) {
            setError('Gagal memuat data.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredAdmins = adminsData.filter(
        (admin) =>
            admin.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            admin.adminName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAdmins.length / ITEMS_PER_PAGE);

    const handleOpenModal = (type, mode, data = null) => setModalState({ type, mode, data });
    const handleCloseModal = () => setModalState({ type: null, mode: null, data: null });
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (modalState.mode === 'add') {
                await adminService.createAdmin(formData, user.token);
                alert('Admin baru berhasil ditambahkan!');
            } else if (modalState.mode === 'edit') {
                await adminService.updateAdmin(modalState.data._id, formData, user.token);
                alert('Admin berhasil diperbarui!');
            }
            fetchData(); // Ambil ulang data untuk update count
            handleCloseModal();
        } catch (err) {
            console.error('Form submit error:', err);
            // Menampilkan pesan error dari backend jika ada
            const errorMessage = err.message || 'Terjadi kesalahan.';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!modalState.data) return;
        setIsSubmitting(true);
        try {
            await adminService.deleteAdmin(modalState.data._id, user.token);
            alert('Admin berhasil dihapus!');
            fetchData(); // Ambil ulang data untuk update count
            handleCloseModal();
        } catch (err) {
            console.error('Delete admin error:', err);
            const errorMessage = err.message || 'Gagal menghapus admin.';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLimitReached = adminsData.length >= settings.maxAdmins;

    // --- DEBUGGING LOG DI SINI ---
    // Mari kita lihat apa sebenarnya isi dari user.role
    if (user) {
        console.log("Current user role:", user.role);
        console.log("Comparison result:", user.role?.toLowerCase() === 'superadmin');
    }

    return (
        <div>
            <PageHeader title="List Akun Admin" />
            
            {user?.role?.toLowerCase() === 'superadmin' && (
                <div className="mb-6">
                    <AdminLimitSettings 
                        currentLimit={settings.maxAdmins}
                        onSettingsUpdate={(newLimit) => setSettings({ ...settings, maxAdmins: newLimit })}
                    />
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative flex-grow">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                     <input type="text" placeholder="Cari..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2.5 w-full max-w-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-background-secondary text-text"/>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                    <p className="text-sm text-text-secondary">
                        <span className="font-bold text-text">{adminsData.length}</span> / {settings.maxAdmins} Admin
                    </p>
                    <button
                        onClick={() => handleOpenModal('form', 'add')}
                        disabled={isLimitReached}
                        className="bg-green-500 text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-600 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isLimitReached ? `Batas maksimum ${settings.maxAdmins} admin telah tercapai` : 'Tambah Admin'}
                    >
                        <PlusIcon />
                        <span>Tambah</span>
                    </button>
                </div>
            </div>

            {isLoading ? (
                <LoadingIndicator />
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div className="bg-background-secondary rounded-xl shadow-md overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-slate-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="p-4 font-bold text-text-secondary w-[5%]">#</th>
                                <th className="p-4 font-bold text-text-secondary w-[25%]">Nama</th>
                                <th className="p-4 font-bold text-text-secondary w-[30%]">E-Mail</th>
                                <th className="p-4 font-bold text-text-secondary w-[15%]">Role</th>
                                <th className="p-4 font-bold text-text-secondary text-center w-[25%]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((admin, index) => (
                                <tr key={admin._id} className="border-b border-background hover:bg-background">
                                    <td className="p-4 text-text-secondary">{indexOfFirstItem + index + 1}</td>
                                    <td className="p-4 text-text font-semibold truncate">{admin.adminName}</td>
                                    <td className="p-4 text-text-secondary truncate">{admin.adminEmail}</td>
                                    <td className="p-4 text-text-secondary capitalize">{admin.role}</td>
                                    <td className="p-4 flex justify-center items-center gap-2">
                                        <button
                                            onClick={() => handleOpenModal('form', 'edit', admin)}
                                            className="bg-yellow-500/10 text-yellow-600 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-yellow-500/20"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal('delete', 'delete', admin)}
                                            className="bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-red-500/20"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 border-t border-background">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalItems={filteredAdmins.length}
                        />
                    </div>
                </div>
            )}

            <AdminFormModal
                isOpen={modalState.type === 'form'}
                onClose={handleCloseModal}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                mode={modalState.mode}
                initialData={modalState.data}
            />
            <ConfirmDeleteModal
                isOpen={modalState.type === 'delete'}
                onClose={handleCloseModal}
                onConfirm={handleDeleteConfirm}
                title="Hapus Admin"
                message={`Apakah Anda yakin ingin menghapus admin "${modalState.data?.adminEmail}"?`}
            />
        </div>
    );
};

export default ManageAdminsPage;