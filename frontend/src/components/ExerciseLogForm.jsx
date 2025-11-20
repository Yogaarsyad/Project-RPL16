// src/components/ExerciseLogForm.jsx
import React, { useState, useEffect } from 'react';
import { useLog } from '../context/LogContext';
// Import ikon-ikon
import { FiActivity, FiClock, FiTrendingUp, FiCalendar, FiPlus } from 'react-icons/fi';

function ExerciseLogForm({ onAddLog }) {
  const [activityName, setActivityName] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [date, setDate] = useState('');
  
  // State untuk animasi muncul (Fade In)
  const [isVisible, setIsVisible] = useState(false);

  const { addExerciseLog } = useLog();

  // Trigger animasi saat komponen dimuat
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fungsi agar date picker langsung muncul saat diklik
  const handleInputClick = (e) => {
    try {
      if (e.target.showPicker) e.target.showPicker();
    } catch (error) {
      console.log("Browser does not support showPicker", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const logData = {
      nama_olahraga: activityName,
      durasi_menit: parseInt(duration),
      kalori_terbakar: parseInt(caloriesBurned),
      tanggal: date
    };

    console.log('Submitting exercise log:', logData);

    addExerciseLog(logData);
    
    // Reset Form
    setActivityName('');
    setDuration('');
    setCaloriesBurned('');
    setDate('');
  };

  return (
    <>
      {/* --- STYLE CSS KHUSUS --- */}
      <style>{`
        /* Menghilangkan spinner (panah hitam) pada input number */
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      <div className={`bg-white p-6 rounded-3xl shadow-xl border border-blue-100 mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* --- HEADER DENGAN GRADIENT & ICON BERANIMASI --- */}
        <div className="flex items-center mb-8 border-b border-gray-100 pb-4">
          {/* ICON ACTIVITY DENGAN ANIMASI SAAT HOVER */}
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-lg mr-4 transition-transform duration-300 hover:rotate-12 group">
            <FiActivity className="text-white text-2xl group-hover:animate-spin" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-blue-600 tracking-tight">
              Add New Exercise
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Stay fit & healthy today 💪
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Input: Exercise Type */}
          <div className="group">
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center group-hover:text-blue-600 transition-colors">
              <FiActivity className="mr-2 text-blue-500" /> Exercise Type
            </label>
            <input
              type="text"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              placeholder="e.g. Running, Cycling"
              required
              className="block w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Grid untuk Duration & Calories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input: Duration */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center group-hover:text-blue-600 transition-colors">
                  <FiClock className="mr-2 text-blue-500" /> Duration (mins)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 30"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </div>

              {/* Input: Calories */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center group-hover:text-blue-600 transition-colors">
                  <FiTrendingUp className="mr-2 text-blue-500" /> Calories (kcal)
                </label>
                <input
                  type="number"
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(e.target.value)}
                  placeholder="e.g. 250"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
              </div>
          </div>

          {/* Input: Date */}
          <div className="group">
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center group-hover:text-blue-600 transition-colors">
              <FiCalendar className="mr-2 text-blue-500" /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onClick={handleInputClick} // Klik area input langsung buka kalender
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center py-4 px-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-200 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:-translate-y-1 hover:shadow-xl active:scale-95 transition-all duration-300"
          >
            <FiPlus className="mr-2 text-2xl" /> Add Exercise Log
          </button>
        </form>
      </div>
    </>
  );
}

export default ExerciseLogForm;