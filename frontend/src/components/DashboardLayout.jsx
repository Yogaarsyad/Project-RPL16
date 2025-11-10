import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiBarChart2, FiHome, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

function DashboardLayout({ onLogout }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLifeMonClick = () => {
    navigate('/dashboard');
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    
    // Navigasi dengan delay untuk menampilkan animasi
    setTimeout(() => {
      navigate('/dashboard/profile');
    }, 300);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* Sidebar Navigation */}
      <aside
        className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        {/* Header dengan LifeMon yang bisa diklik */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <motion.button
            onClick={handleLifeMonClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`font-bold text-xl whitespace-nowrap ${!isSidebarOpen && 'hidden'} bg-transparent border-none text-white cursor-pointer`}
          >
            LifeMon
          </motion.button>
        </div>
        
        {/* Navigasi Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-700 whitespace-nowrap">
            <FiHome className="mr-3 flex-shrink-0" />
            <span className={!isSidebarOpen && 'hidden'}>Dashboard</span>
          </Link>
          
          <Link to="/dashboard/laporan" className="flex items-center p-2 rounded-md hover:bg-gray-700 whitespace-nowrap">
            <FiBarChart2 className="mr-3 flex-shrink-0" />
            <span className={!isSidebarOpen && 'hidden'}>Report</span>
          </Link>

          {/* Profile dengan animasi */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ 
              scale: 0.98,
              backgroundColor: "rgba(55, 65, 81, 0.5)"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link 
              to="/dashboard/profile" 
              onClick={handleProfileClick}
              className="flex items-center p-2 rounded-md hover:bg-gray-700 whitespace-nowrap"
            >
              <motion.div
                animate={{
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              >
                <FiUser className="mr-3 flex-shrink-0" />
              </motion.div>
              <span className={!isSidebarOpen && 'hidden'}>Profil</span>
            </Link>
          </motion.div>
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <motion.button 
            onClick={onLogout} 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center w-full p-2 rounded-md hover:bg-red-500 whitespace-nowrap"
          >
            <FiLogOut className="mr-3 flex-shrink-0" />
            <span className={!isSidebarOpen && 'hidden'}>Logout</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex items-center">
          <motion.button 
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-600 text-2xl"
          >
            {isSidebarOpen ? <FiX /> : <FiMenu />}
          </motion.button>
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