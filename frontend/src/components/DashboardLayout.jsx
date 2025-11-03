import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiBarChart2, FiHome, FiUser } from 'react-icons/fi';

function DashboardLayout({ onLogout }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* Bagian Sidebar (Menu Samping) */}
      <aside
        className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        {/* ... (Judul LifeMon tetap sama) ... */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h1 className={`font-bold text-xl whitespace-nowrap ${!isSidebarOpen && 'hidden'}`}>
            LifeMon
          </h1>
        </div>
        
        {/* Navigasi Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-700 whitespace-nowrap">
            <FiHome className="mr-3 flex-shrink-0" />
            <span className={!isSidebarOpen && 'hidden'}>Dashboard</span>
          </Link>
          
          {/* ▼▼▼ PERBAIKI DI SINI ▼▼▼ */}
          <Link to="/dashboard/laporan" className="flex items-center p-2 rounded-md hover:bg-gray-700 whitespace-nowrap">
            <FiBarChart2 className="mr-3 flex-shrink-0" />
            <span className={!isSidebarOpen && 'hidden'}>Report</span>
          </Link>
          {/* ▲▲▲ SELESAI PERBAIKAN ▲▲▲ */}

          <Link to="/dashboard/profile" className="flex items-center p-2 rounded-md hover:bg-gray-700 whitespace-nowrap">
            <FiUser className="mr-3 flex-shrink-0" />
            <span className={!isSidebarOpen && 'hidden'}>Profil</span>
          </Link>
        </nav>
        
        {/* ... (Tombol Logout tetap sama) ... */}
        <div className="p-4 border-t border-gray-700">
          <button onClick={onLogout} className="flex items-center w-full p-2 rounded-md hover:bg-red-500 whitespace-nowrap">
            <FiLogOut className="mr-3 flex-shrink-0" />
            <span className={!isSidebarOpen && 'hidden'}>Logout</span>
          </button>
        </div>
      </aside>

      {/* ... (Header dan Main Content tetap sama) ... */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex items-center">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-600 text-2xl">
            {isSidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <h2 className="ml-4 text-xl font-semibold text-gray-700">LifeMon Dashboard</h2>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;