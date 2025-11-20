// src/components/SleepLogForm.jsx
import React, { useState, useEffect } from 'react';
import { FiMoon, FiCalendar, FiClock, FiActivity, FiCheckCircle } from 'react-icons/fi';

function SleepLogForm({ onAddLog }) {
  const [date, setDate] = useState(''); 
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [quality, setQuality] = useState('Good');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputClick = (e) => {
    try {
      if (e.target.showPicker) {
        e.target.showPicker();
      }
    } catch (error) {
      console.log("Browser does not support showPicker automatically", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!date || !sleepTime || !wakeTime) {
      alert("Please fill in all fields (Date, Sleep Time, Wake Up Time).");
      return;
    }

    setLoading(true);
    try {
      await onAddLog({
        tanggal: date,
        waktu_tidur: new Date(sleepTime).toISOString(),
        waktu_bangun: new Date(wakeTime).toISOString(),
        kualitas_tidur: quality,
      });

      setSleepTime('');
      setWakeTime('');
      setQuality('Good'); 
    } catch (error) {
      console.error("Error saving log", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`bg-white p-6 rounded-3xl shadow-xl border border-blue-100 mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
    >
      {/* --- HEADER DENGAN ANIMASI IKON BULAN --- */}
      <div className="flex items-center mb-8 border-b border-gray-100 pb-4">
        {/* ICON BULAN DENGAN ANIMASI SPIN SAAT HOVER */}
        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-lg mr-4 transition-transform duration-300 hover:rotate-12">
          <FiMoon className="text-white text-2xl animate-spin-on-hover" /> {/* class baru */}
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-blue-600 tracking-tight">
            New Sleep Record
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Track your sleep quality today ✨
          </p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Input: Date */}
        <div className="group">
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center transition-colors group-hover:text-blue-600">
            <FiCalendar className="mr-2 text-blue-500" /> Date
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            onClick={handleInputClick}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 cursor-pointer"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input: Sleep Time */}
          <div className="group">
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center transition-colors group-hover:text-blue-600">
              <FiClock className="mr-2 text-blue-500" /> Sleep Time
            </label>
            <input
              type="datetime-local"
              value={sleepTime}
              onChange={e => setSleepTime(e.target.value)}
              onClick={handleInputClick}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
              required
            />
          </div>

          {/* Input: Wake Up Time */}
          <div className="group">
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center transition-colors group-hover:text-blue-600">
              <FiClock className="mr-2 text-blue-500" /> Wake Up Time
            </label>
            <input
              type="datetime-local"
              value={wakeTime}
              onChange={e => setWakeTime(e.target.value)}
              onClick={handleInputClick}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
              required
            />
          </div>
        </div>

        {/* Input: Sleep Quality */}
        <div className="group">
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center transition-colors group-hover:text-blue-600">
            <FiActivity className="mr-2 text-blue-500" /> Sleep Quality
          </label>
          <div className="relative">
            <select
              value={quality}
              onChange={e => setQuality(e.target.value)}
              className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none cursor-pointer shadow-sm transition-all"
            >
              <option value="Excellent">😴 Excellent (Deep Sleep)</option>
              <option value="Good">🙂 Good (Restful)</option>
              <option value="Fair">😐 Fair (Average)</option>
              <option value="Poor">😫 Poor (Restless)</option>
              <option value="Insomnia">😵 Insomnia (Difficulty Sleeping)</option>
            </select>
            
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-blue-500">
              <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center py-4 px-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-200 transition-all duration-300 transform 
            ${loading 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl active:scale-95'
            }`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            <>
              <FiCheckCircle className="mr-2 text-2xl" /> Add Sleep Record
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default SleepLogForm;