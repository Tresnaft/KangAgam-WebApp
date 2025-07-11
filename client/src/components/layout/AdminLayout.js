import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
    return (
        <div className="bg-[#DAE4EE] min-h-screen">
            <Sidebar />
            <div className="ml-24 p-8"> {/* ml-24 untuk memberi ruang bagi sidebar */}
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;