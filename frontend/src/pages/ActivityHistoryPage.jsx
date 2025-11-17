// src/pages/ActivityHistoryPage.js

import React, { useState } from 'react';
import { useLog } from '../context/LogContext';
import FoodHistory from '../components/FoodHistory';
import ExerciseHistory from '../components/ExerciseHistory';
import SleepHistory from '../components/SleepHistory';
import ExportButton from '../components/ExportButton';

function ActivityHistoryPage() {
  const [activeTab, setActiveTab] = useState('food');
  const { foodLogs, exerciseLogs, sleepLogs } = useLog();

  const getExportData = () => {
    switch (activeTab) {
      case 'food':
        return foodLogs.map(log => ({
          Date: log.tanggal,
          'Food Name': log.nama_makanan,
          Calories: log.kalori,
          'Logged At': new Date(log.createdAt).toLocaleString()
        }));
      case 'exercise':
        return exerciseLogs.map(log => ({
          Date: log.tanggal,
          Activity: log.jenis_olahraga || log.nama_olahraga,
          'Duration (min)': log.durasi_menit,
          'Calories Burned': log.kalori_terbakar,
          'Logged At': new Date(log.createdAt).toLocaleString()
        }));
      case 'sleep':
        return sleepLogs.map(log => ({
          Date: log.tanggal,
          'Sleep Time': new Date(log.waktu_tidur).toLocaleString(),
          'Wake Up Time': new Date(log.waktu_bangun).toLocaleString(),
          Quality: log.kualitas_tidur,
          'Logged At': new Date(log.createdAt).toLocaleString()
        }));
      default: return [];
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header (Sudah Bagus) */}
        <div className="flex justify-between items-center mb-8 p-6 bg-gradient-to-r from-blue-50 via-white to-orange-50 rounded-lg shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Activity History</h1>
            <p className="text-gray-500">Track all your health activities in one place</p>
          </div>
          <ExportButton data={getExportData()} filename={`${activeTab}-history`} />
        </div>
        

        {/* === Tabs Navigation DIPERBARUI (Tidak ada latar hitam lagi) === */}
        <div className="bg-gray-100 p-1.5 rounded-full flex items-center space-x-2 mb-6 max-w-xl mx-auto shadow-inner">
          <button
            onClick={() => setActiveTab('food')}
            className={`flex-1 py-2.5 px-4 text-center font-semibold text-sm rounded-full transition-all duration-300 ${
              activeTab === 'food'
                ? 'bg-orange-500 text-white shadow-md' // Aktif: Latar solid oranye
                : 'bg-white text-gray-700 hover:bg-gray-50' // INAKTIF: Latar putih, teks abu-abu
            }`}
          >
            🍽️ Food
          </button>
          <button
            onClick={() => setActiveTab('exercise')}
            className={`flex-1 py-2.5 px-4 text-center font-semibold text-sm rounded-full transition-all duration-300 ${
              activeTab === 'exercise'
                ? 'bg-green-500 text-white shadow-md' // Aktif: Latar solid hijau
                : 'bg-white text-gray-700 hover:bg-gray-50' // INAKTIF: Latar putih, teks abu-abu
            }`}
          >
            💪 Exercise
          </button>
          <button
            onClick={() => setActiveTab('sleep')}
            className={`flex-1 py-2.5 px-4 text-center font-semibold text-sm rounded-full transition-all duration-300 ${
              activeTab === 'sleep'
                ? 'bg-blue-500 text-white shadow-md' // Aktif: Latar solid biru
                : 'bg-white text-gray-700 hover:bg-gray-50' // INAKTIF: Latar putih, teks abu-abu
            }`}
          >
            😴 Sleep
          </button>
        </div>
        {/* === AKHIR Tabs Navigation DIPERBARUI === */}
        

        {/* Tab Content (Tidak ada perubahan di sini) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {activeTab === 'food' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-700">Food Consumption History</h2>
                <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                  {foodLogs.length} records
                </span>
              </div>
              <FoodHistory foodLogs={foodLogs} />
            </div>
          )}

          {activeTab === 'exercise' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-700">Exercise Activity History</h2>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  {exerciseLogs.length} records
                </span>
              </div>
              <ExerciseHistory exerciseLogs={exerciseLogs} />
            </div>
          )}

          {activeTab === 'sleep' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-700">Sleep Pattern History</h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {sleepLogs.length} records
                </span>
              </div>
              <SleepHistory sleepLogs={sleepLogs} />
            </div>
          )}
        </div>

        {/* Quick Stats Summary (Tidak ada perubahan di sini) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg mr-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Food Records</h3>
                <p className="text-2xl font-bold text-orange-600">{foodLogs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <span className="text-2xl">💪</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Exercise Sessions</h3>
                <p className="text-2xl font-bold text-green-600">{exerciseLogs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <span className="text-2xl">😴</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Sleep Records</h3>
                <p className="text-2xl font-bold text-blue-600">{sleepLogs.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityHistoryPage;