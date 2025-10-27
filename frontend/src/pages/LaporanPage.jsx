import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

function LaporanPage() {
  // const navigate = useNavigate(); // Jika perlu
  // const handleLogout = () => { /* ... logika logout ... */ };

  return (
    <DashboardLayout title="Health Report">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Weekly Calorie Chart</h3>
          <p className="text-gray-600">(Chart content will be displayed here)</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Exercise Summary</h3>
          <p className="text-gray-600">(Summary content will be displayed here)</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default LaporanPage;