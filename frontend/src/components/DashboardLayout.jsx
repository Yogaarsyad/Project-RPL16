import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiBarChart2, FiHome, FiUser } from 'react-icons/fi';

function DashboardLayout({ onLogout }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detect mobile screen
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleLifeMonClick = () => {
    navigate('/dashboard');
    if (isMobile) setSidebarOpen(false);
  };

  const handleNavClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Mobile Overlay */}
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out z-30
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'} 
          md:w-64 md:translate-x-0 fixed md:static h-full overflow-hidden`}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center min-w-[256px]">
          <button
            onClick={handleLifeMonClick}
            className="font-bold text-xl whitespace-nowrap bg-transparent border-none text-white cursor-pointer hover:text-blue-300 transition-colors"
          >
            LifeMon
          </button>
        </div>
        
        {/* Navigasi Menu */}
        <nav className="flex-1 p-4 space-y-2 min-w-[256px]">
          <Link 
            to="/dashboard" 
            onClick={handleNavClick}
            className="flex items-center p-3 rounded-md hover:bg-gray-700 whitespace-nowrap transition-all duration-200"
          >
            <FiHome className="mr-3 flex-shrink-0 text-lg" />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/dashboard/laporan" 
            onClick={handleNavClick}
            className="flex items-center p-3 rounded-md hover:bg-gray-700 whitespace-nowrap transition-all duration-200"
          >
            <FiBarChart2 className="mr-3 flex-shrink-0 text-lg" />
            <span>Report</span>
          </Link>

          <Link 
            to="/dashboard/profile" 
            onClick={handleNavClick}
            className="flex items-center p-3 rounded-md hover:bg-gray-700 whitespace-nowrap transition-all duration-200"
          >
            <FiUser className="mr-3 flex-shrink-0 text-lg" />
            <span>Profil</span>
          </Link>
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700 min-w-[256px]">
          <button 
            onClick={onLogout} 
            className="flex items-center w-full p-3 rounded-md hover:bg-red-600 whitespace-nowrap transition-all duration-200"
          >
            <FiLogOut className="mr-3 flex-shrink-0 text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-md p-4 flex items-center sticky top-0 z-10">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
            className="text-gray-600 text-2xl p-2 rounded-lg hover:bg-gray-200 transition-colors md:hidden"
          >
            {isSidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <h2 className="ml-2 text-lg md:text-xl font-semibold text-gray-700 truncate">
            LifeMon Dashboard
          </h2>
        </header>

        <main className="flex-1 p-3 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;