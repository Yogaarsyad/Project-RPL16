import React, { useState } from 'react';
import { useLog } from '../context/LogContext';
import { 
  addFoodLog, 
  deleteFoodLog,
  addSleepLog, 
  deleteSleepLog,
  addExerciseLog,
  deleteExerciseLog
} from '../services/api';
import { useNavigate } from 'react-router-dom';
import FoodLogForm from '../components/FoodLogForm';
import SleepLogForm from '../components/SleepLogForm';
import ExerciseLogForm from '../components/ExerciseLogForm';
import { FiTrash2, FiX, FiCheck, FiMinus, FiPlus } from 'react-icons/fi';

function DashboardPage() {
  // Gunakan context untuk state management
  const { foodLogs = [], exerciseLogs = [], sleepLogs = [], addFoodLog: addFoodToContext, addExerciseLog: addExerciseToContext, addSleepLog: addSleepToContext } = useLog();
  
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  // Calculate today's totals from context dengan default value
  const today = new Date().toISOString().split('T')[0];
  
  const todayFoodCalories = (foodLogs || [])
    .filter(log => log.tanggal === today)
    .reduce((sum, log) => sum + (log.kalori || 0), 0);

  const todayExerciseCalories = (exerciseLogs || [])
    .filter(log => log.tanggal === today)
    .reduce((sum, log) => sum + (log.kalori_terbakar || 0), 0);

  const todaySleepHours = (sleepLogs || [])
    .filter(log => log.tanggal === today)
    .reduce((sum, log) => {
      if (!log.waktu_tidur || !log.waktu_bangun) return sum;
      const sleepTime = new Date(log.waktu_tidur);
      const wakeTime = new Date(log.waktu_bangun);
      const hours = (wakeTime - sleepTime) / (1000 * 60 * 60);
      return sum + (hours || 0);
    }, 0);

  // Handlers untuk menambah log
  const handleAddFoodLog = async (logData) => {
    try {
      addFoodToContext(logData);
      await addFoodLog(logData);
    } catch (error) {
      console.error('Failed to add food log', error);
      alert('Failed to add food log');
    }
  };

  const handleAddSleepLog = async (logData) => {
    try {
      addSleepToContext(logData);
      await addSleepLog(logData);
    } catch (error) {
      console.error('Failed to add sleep log', error);
      alert('Failed to add sleep log');
    }
  };

  const handleAddExerciseLog = async (logData) => {
    try {
      console.log('🔄 Adding exercise log:', logData);
      addExerciseToContext(logData);
      await addExerciseLog(logData);
    } catch (error) {
      console.error('❌ Failed to add exercise log:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Unknown error';
      alert(`Failed to add exercise log: ${errorMessage}`);
    }
  };

  // Delete handlers
  const handleDeleteFoodLog = async (id) => {
    try {
      await deleteFoodLog(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete food log', error);
      alert('Failed to delete food log');
    }
  };

  const handleDeleteExerciseLog = async (id) => {
    try {
      await deleteExerciseLog(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete exercise log', error);
      alert('Failed to delete exercise log');
    }
  };

  const handleDeleteSleepLog = async (id) => {
    try {
      await deleteSleepLog(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete sleep log', error);
      alert('Failed to delete sleep log');
    }
  };

  const confirmDelete = (type, id) => {
    setDeleteConfirm({ type, id });
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const executeDelete = () => {
    if (!deleteConfirm) return;

    switch (deleteConfirm.type) {
      case 'food':
        handleDeleteFoodLog(deleteConfirm.id);
        break;
      case 'exercise':
        handleDeleteExerciseLog(deleteConfirm.id);
        break;
      case 'sleep':
        handleDeleteSleepLog(deleteConfirm.id);
        break;
      default:
        break;
    }
  };

  // Helper function to calculate sleep duration in hours
  const getSleepDuration = (start, end) => {
    if (!start || !end) return '0';
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate) || isNaN(endDate)) return '0';
    const diffMs = endDate - startDate;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours.toFixed(2);
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => {
    if (!deleteConfirm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
          <h3 className="text-lg font-bold text-red-600 mb-4">Confirm Delete</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this {deleteConfirm.type} log? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={cancelDelete}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex items-center"
            >
              <FiX className="mr-2" />
              Cancel
            </button>
            <button
              onClick={executeDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
            >
              <FiCheck className="mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 py-4 px-2 sm:px-4">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal />
      
      <div className="max-w-6xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Food Today</h3>
            <p className="text-2xl font-bold text-blue-600">{todayFoodCalories} kcal</p>
            <p className="text-sm text-gray-600">{(foodLogs || []).filter(log => log.tanggal === today).length} meals</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Exercise Today</h3>
            <p className="text-2xl font-bold text-green-600">{todayExerciseCalories} kcal burned</p>
            <p className="text-sm text-gray-600">{(exerciseLogs || []).filter(log => log.tanggal === today).length} sessions</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sleep Today</h3>
            <p className="text-2xl font-bold text-purple-600">{todaySleepHours.toFixed(1)} hours</p>
            <p className="text-sm text-gray-600">{(sleepLogs || []).filter(log => log.tanggal === today).length} records</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Column 1: Input Forms */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border-t-4 border-blue-400 p-4 md:p-6">
              <FoodLogForm onAddLog={handleAddFoodLog} />
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border-t-4 border-blue-400 p-4 md:p-6">
              <ExerciseLogForm onAddLog={handleAddExerciseLog} />
            </div>
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border-t-4 border-blue-400 p-4 md:p-6">
              <SleepLogForm onAddLog={handleAddSleepLog} />
            </div>
          </div>

          {/* Column 2: Log Lists */}
          <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg border-t-4 border-blue-400">
            {/* Food History */}
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-blue-700 text-center">Food History</h3>
            <div className="h-64 md:h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
              <ul className="space-y-3 md:space-y-4">
                {(foodLogs || []).length > 0 ? (
                  (foodLogs || []).map(log => (
                    <li
                      key={log.id}
                      className="flex justify-between items-center p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 border border-blue-200 shadow hover:scale-[1.02] transition-transform group"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-blue-900 text-sm md:text-base">{log.nama_makanan}</p>
                        <p className="text-xs text-blue-600">
                          {log.tanggal ? new Date(log.tanggal).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'No date'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <span className="font-bold text-blue-700 bg-blue-100 px-2 py-1 md:px-3 md:py-1 rounded-full shadow text-sm md:text-base">
                          {log.kalori || 0} kcal
                        </span>
                        <button
                          onClick={() => confirmDelete('food', log.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 md:p-2 text-red-500 hover:bg-red-100 rounded-full"
                          title="Delete food log"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-blue-600 text-center mt-4">No food data yet.</p>
                )}
              </ul>
            </div>

            {/* Exercise History */}
            <h3 className="text-xl md:text-2xl font-bold mt-8 md:mt-10 mb-4 md:mb-6 text-blue-700 text-center">Exercise History</h3>
            <div className="h-64 md:h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
              <ul className="space-y-3 md:space-y-4">
                {(exerciseLogs || []).length > 0 ? (
                  (exerciseLogs || []).map(log => (
                    <li
                      key={log.id}
                      className="flex justify-between items-center p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 border border-blue-200 shadow hover:scale-[1.02] transition-transform group"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-blue-900 text-sm md:text-base">{log.jenis_olahraga || log.nama_olahraga || 'Unknown Activity'}</p>
                        <p className="text-xs text-blue-600">
                          {log.tanggal
                            ? new Date(log.tanggal).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : 'Date unavailable'}
                        </p>
                        <p className="text-xs text-blue-500">Duration: {log.durasi_menit || 0} minutes</p>
                      </div>
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <span className="font-bold text-blue-700 bg-blue-100 px-2 py-1 md:px-3 md:py-1 rounded-full shadow text-sm md:text-base">
                          {log.kalori_terbakar || 0} kcal
                        </span>
                        <button
                          onClick={() => confirmDelete('exercise', log.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 md:p-2 text-red-500 hover:bg-red-100 rounded-full"
                          title="Delete exercise log"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-blue-600 text-center mt-4">No exercise data yet.</p>
                )}
              </ul>
            </div>

            {/* Sleep History */}
            <h3 className="text-xl md:text-2xl font-bold mt-8 md:mt-10 mb-4 md:mb-6 text-blue-700 text-center">Sleep History</h3>
            <div className="h-64 md:h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
              <ul className="space-y-3 md:space-y-4">
                {(sleepLogs || []).length > 0 ? (
                  (sleepLogs || []).map(log => (
                    <li
                      key={log.id}
                      className="flex justify-between items-center p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 border border-blue-200 shadow hover:scale-[1.02] transition-transform group"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-blue-900 text-sm md:text-base">
                          {log.waktu_tidur && log.waktu_bangun
                            ? `${getSleepDuration(log.waktu_tidur, log.waktu_bangun)} hours of sleep`
                            : 'Duration unavailable'}
                        </p>
                        <p className="text-xs text-blue-600">
                          {log.tanggal
                            ? new Date(log.tanggal).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : 'Date unavailable'}
                        </p>
                        {log.kualitas_tidur && <p className="text-xs text-blue-500">Quality: {log.kualitas_tidur}</p>}
                      </div>
                      <button
                        onClick={() => confirmDelete('sleep', log.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 md:p-2 text-red-500 hover:bg-red-100 rounded-full"
                        title="Delete sleep log"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-blue-600 text-center mt-4">No sleep data yet.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;