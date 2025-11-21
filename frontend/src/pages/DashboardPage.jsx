import React, { useState } from 'react';
import { useLog } from '../context/LogContext';
import { 
  addFoodLog, deleteFoodLog,
  addSleepLog, deleteSleepLog,
  addExerciseLog, deleteExerciseLog
} from '../services/api';
import FoodLogForm from '../components/FoodLogForm';
import SleepLogForm from '../components/SleepLogForm';
import ExerciseLogForm from '../components/ExerciseLogForm';
import { FiTrash2, FiX, FiCheck, FiCoffee, FiActivity, FiMoon, FiClock } from 'react-icons/fi';

function DashboardPage() {
  const { 
    foodLogs = [], exerciseLogs = [], sleepLogs = [], 
    addFoodLog: addFoodToContext, 
    addExerciseLog: addExerciseToContext, 
    addSleepLog: addSleepToContext 
  } = useLog();
  
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // --- KALKULASI DATA ---
  const today = new Date().toISOString().split('T')[0];
  
  const todayFoodCalories = (foodLogs || []).filter(log => log.tanggal === today).reduce((sum, log) => sum + (log.kalori || 0), 0);
  const todayExerciseCalories = (exerciseLogs || []).filter(log => log.tanggal === today).reduce((sum, log) => sum + (log.kalori_terbakar || 0), 0);
  const todaySleepHours = (sleepLogs || []).filter(log => log.tanggal === today).reduce((sum, log) => {
      if (!log.waktu_tidur || !log.waktu_bangun) return sum;
      const sleepTime = new Date(log.waktu_tidur);
      const wakeTime = new Date(log.waktu_bangun);
      const hours = (wakeTime - sleepTime) / (1000 * 60 * 60);
      return sum + (hours || 0);
    }, 0);

  // --- HANDLERS ---
  const handleAddFoodLog = async (logData) => { try { addFoodToContext(logData); await addFoodLog(logData); } catch (e) { alert('Error adding food'); } };
  const handleAddSleepLog = async (logData) => { try { addSleepToContext(logData); await addSleepLog(logData); } catch (e) { alert('Error adding sleep'); } };
  const handleAddExerciseLog = async (logData) => { try { addExerciseToContext(logData); await addExerciseLog(logData); } catch (e) { alert('Error adding exercise'); } };

  // Delete Handlers
  const handleDeleteFoodLog = async (id) => { try { await deleteFoodLog(id); setDeleteConfirm(null); } catch (e) { alert('Error deleting'); } };
  const handleDeleteExerciseLog = async (id) => { try { await deleteExerciseLog(id); setDeleteConfirm(null); } catch (e) { alert('Error deleting'); } };
  const handleDeleteSleepLog = async (id) => { try { await deleteSleepLog(id); setDeleteConfirm(null); } catch (e) { alert('Error deleting'); } };

  const confirmDelete = (type, id) => setDeleteConfirm({ type, id });
  const cancelDelete = () => setDeleteConfirm(null);
  
  const executeDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'food') handleDeleteFoodLog(deleteConfirm.id);
    if (deleteConfirm.type === 'exercise') handleDeleteExerciseLog(deleteConfirm.id);
    if (deleteConfirm.type === 'sleep') handleDeleteSleepLog(deleteConfirm.id);
  };

  const getSleepDuration = (start, end) => {
    if (!start || !end) return '0';
    const diffMs = new Date(end) - new Date(start);
    return (diffMs / (1000 * 60 * 60)).toFixed(2);
  };

  // Modal Delete Elegant
  const DeleteConfirmationModal = () => {
    if (!deleteConfirm) return null;
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm transition-all">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 transform scale-100 transition-all border border-gray-100">
          <div className="text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <FiTrash2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Record?</h3>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              Are you sure you want to remove this {deleteConfirm.type} log? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={cancelDelete} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-colors">Cancel</button>
            <button onClick={executeDelete} className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium shadow-lg shadow-red-200 transition-colors">Delete</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <DeleteConfirmationModal />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* 1. STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-lg shadow-blue-100/50 border border-blue-50 flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
             <div className="p-3 bg-blue-50 rounded-2xl mb-3 text-blue-500"><FiCoffee size={24}/></div>
             <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Calories In</h3>
             <p className="text-3xl font-black text-blue-600 mt-1">{todayFoodCalories} <span className="text-sm text-gray-400 font-normal">kcal</span></p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-lg shadow-green-100/50 border border-green-50 flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
             <div className="p-3 bg-green-50 rounded-2xl mb-3 text-green-500"><FiActivity size={24}/></div>
             <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Calories Burned</h3>
             <p className="text-3xl font-black text-green-600 mt-1">{todayExerciseCalories} <span className="text-sm text-gray-400 font-normal">kcal</span></p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-lg shadow-purple-100/50 border border-purple-50 flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
             <div className="p-3 bg-purple-50 rounded-2xl mb-3 text-purple-500"><FiMoon size={24}/></div>
             <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Sleep Duration</h3>
             <p className="text-3xl font-black text-purple-600 mt-1">{todaySleepHours.toFixed(1)} <span className="text-sm text-gray-400 font-normal">hrs</span></p>
          </div>
        </div>

        {/* --- SECTION 1: MAKANAN --- */}
        <section>
          <div className="flex items-center mb-6 px-1">
             <div className="w-1.5 h-8 bg-blue-500 rounded-full mr-3"></div>
             <h2 className="text-2xl font-bold text-gray-800">Food & Nutrition</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
               <FoodLogForm onAddLog={handleAddFoodLog} />
            </div>
            {/* HISTORY MAKANAN (Background Biru Muda Halus) */}
            <div className="lg:col-span-2 bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-100 overflow-hidden">
              <div className="p-6 border-b border-blue-100/50 flex justify-between items-center bg-white/60 backdrop-blur-sm">
                 <h3 className="font-bold text-blue-900 text-lg">Today's Meals</h3>
                 <span className="px-3 py-1 bg-white border border-blue-100 text-blue-600 text-xs font-bold rounded-full">
                   {foodLogs.length} Items
                 </span>
              </div>
              <div className="h-[400px] overflow-y-auto p-5 space-y-3 custom-scrollbar">
                 {foodLogs.length > 0 ? (
                    foodLogs.map(log => (
                      <div key={log.id} className="flex justify-between items-center p-4 rounded-2xl bg-white border border-blue-50 hover:shadow-md hover:border-blue-200 transition-all group">
                        <div>
                          <p className="font-bold text-blue-900 text-lg">{log.nama_makanan}</p>
                          <p className="text-xs text-blue-400 font-medium mt-0.5 flex items-center">
                            <FiClock className="mr-1"/> {new Date(log.tanggal).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl text-sm border border-blue-100">
                             {log.kalori} kcal
                           </span>
                           <button onClick={() => confirmDelete('food', log.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                             <FiTrash2 />
                           </button>
                        </div>
                      </div>
                    ))
                 ) : ( <EmptyState icon={<FiCoffee/>} text="No meals logged yet" /> )}
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: OLAHRAGA --- */}
        <section>
          <div className="flex items-center mb-6 px-1">
             <div className="w-1.5 h-8 bg-green-500 rounded-full mr-3"></div>
             <h2 className="text-2xl font-bold text-gray-800">Exercise & Activity</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
               <ExerciseLogForm onAddLog={handleAddExerciseLog} />
            </div>
            {/* HISTORY OLAHRAGA (Background Hijau Muda Halus) */}
            <div className="lg:col-span-2 bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-xl shadow-green-100/50 border border-green-100 overflow-hidden">
              <div className="p-6 border-b border-green-100/50 flex justify-between items-center bg-white/60 backdrop-blur-sm">
                 <h3 className="font-bold text-green-900 text-lg">Activity History</h3>
                 <span className="px-3 py-1 bg-white border border-green-100 text-green-600 text-xs font-bold rounded-full">
                   Active
                 </span>
              </div>
              <div className="h-[400px] overflow-y-auto p-5 space-y-3 custom-scrollbar">
                 {exerciseLogs.length > 0 ? (
                    exerciseLogs.map(log => (
                      <div key={log.id} className="flex justify-between items-center p-4 rounded-2xl bg-white border border-green-50 hover:shadow-md hover:border-green-200 transition-all group">
                        <div>
                          <p className="font-bold text-green-900 text-lg">{log.nama_olahraga}</p>
                          <p className="text-xs text-green-500 font-medium mt-0.5 flex items-center">
                            <FiActivity className="mr-1"/> {log.durasi_menit} mins
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-xl text-sm border border-green-100">
                             {log.kalori_terbakar} kcal
                           </span>
                           <button onClick={() => confirmDelete('exercise', log.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                             <FiTrash2 />
                           </button>
                        </div>
                      </div>
                    ))
                 ) : ( <EmptyState icon={<FiActivity/>} text="No activities logged yet" /> )}
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: TIDUR --- */}
        <section>
          <div className="flex items-center mb-6 px-1">
             <div className="w-1.5 h-8 bg-purple-500 rounded-full mr-3"></div>
             <h2 className="text-2xl font-bold text-gray-800">Sleep & Rest</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
               <SleepLogForm onAddLog={handleAddSleepLog} />
            </div>
            {/* HISTORY TIDUR (Background Ungu Muda Halus) */}
            <div className="lg:col-span-2 bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-xl shadow-purple-100/50 border border-purple-100 overflow-hidden">
              <div className="p-6 border-b border-purple-100/50 flex justify-between items-center bg-white/60 backdrop-blur-sm">
                 <h3 className="font-bold text-purple-900 text-lg">Sleep History</h3>
                 <span className="px-3 py-1 bg-white border border-purple-100 text-purple-600 text-xs font-bold rounded-full">
                   Rest Logs
                 </span>
              </div>
              <div className="h-[400px] overflow-y-auto p-5 space-y-3 custom-scrollbar">
                 {sleepLogs.length > 0 ? (
                    sleepLogs.map(log => (
                      <div key={log.id} className="flex justify-between items-center p-4 rounded-2xl bg-white border border-purple-50 hover:shadow-md hover:border-purple-200 transition-all group">
                        <div>
                          <p className="font-bold text-purple-900 text-lg">
                             {log.waktu_tidur && log.waktu_bangun 
                               ? `${getSleepDuration(log.waktu_tidur, log.waktu_bangun)} hrs sleep` 
                               : 'Sleep Record'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-xs font-semibold">
                              {log.kualitas_tidur}
                            </span>
                            <span className="text-xs text-purple-400 font-medium">
                              {new Date(log.tanggal).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="text-right hidden sm:block space-y-1">
                              <div className="text-xs font-medium text-purple-400 bg-purple-50 px-2 py-1 rounded-lg inline-block mr-1">
                                🛌 {new Date(log.waktu_tidur).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                              <div className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg inline-block">
                                🌅 {new Date(log.waktu_bangun).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                           </div>
                           <button onClick={() => confirmDelete('sleep', log.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                             <FiTrash2 />
                           </button>
                        </div>
                      </div>
                    ))
                 ) : ( <EmptyState icon={<FiMoon/>} text="No sleep records yet" /> )}
              </div>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-300 py-10">
      <div className="text-4xl mb-3 opacity-30">{icon}</div>
      <p className="font-medium">{text}</p>
    </div>
  );
}

export default DashboardPage;