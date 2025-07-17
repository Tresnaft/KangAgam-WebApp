import React, { useState, useEffect, useCallback } from 'react';
import Pagination from '../../components/ui/Pagination';
import AdminFormModal from '../../components/admin/AdminFormModal';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import adminService from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';

const ITEMS_PER_PAGE = 5;

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

const ManageAdminsPage = () => {
    const { user } = useAuth();
    
    const [adminsData, setAdminsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [modalState, setModalState] = useState({ type: null, data: null });
    const [currentPage, setCurrentPage] = useState(1);

    const fetchAdmins = useCallback(async () => {
        if (!user?.token) {
            setError("Otorisasi gagal. Silakan login kembali.");
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const response = await adminService.getAllAdmins(user.token);
            setAdminsData(response.data || []);
        } catch (err) {
            setError("Gagal memuat data admin.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    const filteredAdmins = adminsData.filter(admin =>
        admin.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.adminName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAdmins.length / ITEMS_PER_PAGE);

    const handleOpenModal = (type, data = null) => setModalState({ type, data });
    const handleCloseModal = () => setModalState({ type: null, data: null });
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
            fetchAdmins();
            handleCloseModal();
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Terjadi kesalahan.";
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
            fetchAdmins();
            handleCloseModal();
        } catch (err) {
            alert('Gagal menghapus admin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">List Akun Admin</h1>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                        <input type="text" placeholder="Cari..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg"/>
                    </div>
                    <button onClick={() => handleOpenModal('add')} className="bg-green-500 text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-600 flex-shrink-0">
                        <PlusIcon />
                        <span>Tambah</span>
                    </button>
                </div>
            </div>

            {isLoading ? <p>Memuat data admin...</p> : error ? <p className="text-red-500">{error}</p> : (
                <div className="hidden lg:flex flex-col bg-white rounded-xl shadow-md min-h-[480px]">
                    <div className="overflow-x-auto flex-grow">
                        <table className="w-full text-left table-fixed">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 font-bold text-gray-600 w-[5%]">#</th>
                                    <th className="p-4 font-bold text-gray-600 w-[30%]">Nama</th>
                                    <th className="p-4 font-bold text-gray-600 w-[40%]">E-Mail</th>
                                    <th className="p-4 font-bold text-gray-600 text-center w-[25%]">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((admin, index) => (
                                    <tr key={admin._id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-4 text-gray-700">{indexOfFirstItem + index + 1}</td>
                                        <td className="p-4 text-gray-800 font-semibold truncate">{admin.adminName}</td>
                                        <td className="p-4 text-gray-700 truncate">{admin.adminEmail}</td>
                                        <td className="p-4 flex justify-center items-center gap-2">
                                            <button onClick={() => handleOpenModal('edit', admin)} className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-yellow-200">Edit</button>
                                            <button onClick={() => handleOpenModal('delete', admin)} className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-red-200">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-gray-200">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalItems={filteredAdmins.length} />
                    </div>
                </div>
            )}

            <AdminFormModal 
                isOpen={modalState.type === 'add' || modalState.type === 'edit'}
                onClose={handleCloseModal}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting} // Kirim status submitting ke modal
                mode={modalState.type}
                initialData={modalState.data}
            />
            <ConfirmDeleteModal
                isOpen={modalState.type === 'delete'}
                onClose={handleCloseModal}
                onConfirm={handleDeleteConfirm}
                isSubmitting={isSubmitting} // Kirim status submitting ke modal
                title="Hapus Admin"
                message={`Apakah Anda yakin ingin menghapus admin "${modalState.data?.adminEmail}"?`}
            />
        </div>
    );
};

export default ManageAdminsPage;