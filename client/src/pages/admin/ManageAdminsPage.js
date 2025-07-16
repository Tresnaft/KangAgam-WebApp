import React, { useState } from 'react';
import Pagination from '../../components/ui/Pagination';
import AdminFormModal from '../../components/admin/AdminFormModal';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';

// --- DATA SIMULASI ---
const initialAdminsData = [
    { id: 1, email: 'ondol@sigarda.com', role: 'SuperAdmin', dateAdded: '15 Mei 2024 09:33', lastVerified: '15 Mei 2024 09:45' },
    { id: 2, email: 'budi@sigarda.com', role: 'Admin', dateAdded: '15 Mei 2024 09:33', lastVerified: '16 Mei 2024 07:04' },
    { id: 3, email: 'coco@sigarda.com', role: 'Admin', dateAdded: '15 Mei 2024 09:33', lastVerified: '17 Mei 2024 11:15' },
    { id: 4, email: 'raihan@sigarda.com', role: 'SuperAdmin', dateAdded: '15 Mei 2024 09:33', lastVerified: '15 Mei 2024 09:39' },
    { id: 5, email: 'tresna@sigarda.com', role: 'Admin', dateAdded: '15 Mei 2024 09:33', lastVerified: '15 Mei 2024 09:40' },
    { id: 6, email: 'dian@sigarda.com', role: 'Admin', dateAdded: '16 Mei 2024 11:00', lastVerified: '18 Mei 2024 12:00' },
];
// --------------------

const ITEMS_PER_PAGE = 5;

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

const ManageAdminsPage = () => {
    const [adminsData, setAdminsData] = useState(initialAdminsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalState, setModalState] = useState({ type: null, data: null });
    const [currentPage, setCurrentPage] = useState(1);

    const filteredAdmins = adminsData.filter(admin =>
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAdmins.length / ITEMS_PER_PAGE);

    const handleOpenModal = (type, data = null) => setModalState({ type, data });
    const handleCloseModal = () => setModalState({ type: null, data: null });
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleFormSubmit = (formData) => {
        if (modalState.type === 'add') {
            const newAdmin = { id: Date.now(), ...formData, dateAdded: new Date().toLocaleString('id-ID'), lastVerified: new Date().toLocaleString('id-ID') };
            setAdminsData(prev => [newAdmin, ...prev]);
        } else if (modalState.type === 'edit') {
            setAdminsData(prev => prev.map(admin => 
                admin.id === modalState.data.id ? { ...admin, ...formData } : admin
            ));
        }
        handleCloseModal();
    };

    const handleDeleteConfirm = () => {
        setAdminsData(prev => prev.filter(admin => admin.id !== modalState.data.id));
        handleCloseModal();
    };

    return (
        <div>
            {/* Header Halaman */}
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

            {/* Tampilan Tabel untuk Desktop */}
            <div className="hidden lg:flex flex-col bg-white rounded-xl shadow-md min-h-[480px]">
                <div className="overflow-x-auto flex-grow">
                    <table className="w-full text-left table-fixed">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 font-bold text-gray-600 w-[5%]">#</th>
                                <th className="p-4 font-bold text-gray-600 w-[25%]">E-Mail</th>
                                <th className="p-4 font-bold text-gray-600 w-[15%]">Role</th>
                                <th className="p-4 font-bold text-gray-600 w-[20%]">Tanggal Ditambahkan</th>
                                <th className="p-4 font-bold text-gray-600 w-[20%]">Tanggal Verifikasi</th>
                                <th className="p-4 font-bold text-gray-600 text-center w-[15%]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((admin, index) => (
                                <tr key={admin.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-4 text-gray-700">{indexOfFirstItem + index + 1}</td>
                                    <td className="p-4 text-gray-800 font-semibold truncate">{admin.email}</td>
                                    <td className="p-4 text-gray-700">{admin.role}</td>
                                    <td className="p-4 text-gray-700">{admin.dateAdded}</td>
                                    <td className="p-4 text-gray-700">{admin.lastVerified}</td>
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

            {/* Tampilan Daftar untuk Mobile */}
            <div className="lg:hidden bg-white rounded-xl shadow-md">
                <div className="min-h-[420px]">
                    {currentItems.map((admin) => (
                        <div key={admin.id} className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div>
                                <p className="font-bold text-gray-800">{admin.email}</p>
                                <p className="text-sm text-gray-500">{admin.role}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleOpenModal('edit', admin)} className="bg-yellow-100 text-yellow-800 text-sm font-bold p-2 rounded-lg hover:bg-yellow-200">Edit</button>
                                <button onClick={() => handleOpenModal('delete', admin)} className="bg-red-100 text-red-800 text-sm font-bold p-2 rounded-lg hover:bg-red-200">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalItems={filteredAdmins.length} />
                </div>
            </div>

            {/* Render semua modal di sini */}
            <AdminFormModal 
                isOpen={modalState.type === 'add' || modalState.type === 'edit'}
                onClose={handleCloseModal}
                onSubmit={handleFormSubmit}
                mode={modalState.type}
                initialData={modalState.data}
            />
            <ConfirmDeleteModal
                isOpen={modalState.type === 'delete'}
                onClose={handleCloseModal}
                onConfirm={handleDeleteConfirm}
                title="Hapus Admin"
                message={`Apakah Anda yakin ingin menghapus admin "${modalState.data?.email}"?`}
            />
        </div>
    );
};

export default ManageAdminsPage;