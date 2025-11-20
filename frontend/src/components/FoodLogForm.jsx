// src/components/FoodLogForm.jsx
import React, { useState, useEffect } from 'react';
import { checkCalories } from '../services/api';
import { useLog } from '../context/LogContext';
import { FiCoffee, FiActivity, FiCalendar, FiSearch, FiCheckCircle, FiInfo, FiPlus } from 'react-icons/fi';

function FoodLogForm() {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [checking, setChecking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { addFoodLog } = useLog();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputClick = (e) => {
    try {
      if (e.target.showPicker) e.target.showPicker();
    } catch (error) {
      console.log("Browser does not support showPicker", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    addFoodLog({ 
      nama_makanan: foodName, 
      kalori: parseInt(calories), 
      tanggal: date 
    });
    
    setFoodName('');
    setCalories('');
    setDate('');
    setAiResponse(null);
  };
  
  return (
    <>
      {/* --- STYLE KHUSUS UNTUK MENGHILANGKAN KOTAK HITAM (SPINNER) --- */}
      <style>{`
        /* Chrome, Safari, Edge, Opera */
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        /* Firefox */
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      <div className={`bg-white p-6 rounded-3xl shadow-xl border border-blue-100 mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* --- HEADER --- */}
        <div className="flex items-center mb-8 border-b border-gray-100 pb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-lg mr-4 transition-transform duration-300 hover:rotate-12">
            <FiCoffee className="text-white text-2xl animate-spin-on-hover" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-blue-600 tracking-tight">
              New Food Log
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Track your calories & nutrition 🍎
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Input: Food Name + Check Button */}
          <div className="group">
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center group-hover:text-blue-600 transition-colors">
              <FiCoffee className="mr-2 text-blue-500" /> Food Name
            </label>
            <div className="flex relative shadow-sm rounded-xl">
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g., Fried Rice"
                required
                className="block w-full px-4 py-3 rounded-l-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!foodName.trim()) return;
                  try {
                    setChecking(true);
                    setAiResponse(null);
                    const res = await checkCalories(foodName.trim());
                    if (res?.data?.kcal_per_100g != null) {
                      setCalories(String(res.data.kcal_per_100g));
                    }
                    setAiResponse(res.data);
                  } catch (err) {
                    const msg = err.response?.data?.message || err.message;
                    setAiResponse({ error: msg });
                  } finally {
                    setChecking(false);
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-200 bg-blue-50 text-blue-600 font-bold text-sm rounded-r-xl hover:bg-blue-100 transition-colors"
              >
                {checking ? (
                   <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                ) : (
                  <>
                    <FiSearch className="mr-2" /> AI Check
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input: Calories (CLEAN NO BLACK BOX) */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center group-hover:text-blue-600 transition-colors">
                  <FiActivity className="mr-2 text-blue-500" /> Calories (kcal)
                </label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="e.g., 450"
                  required
                  // Tambahkan transition dan styling agar elegan
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
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
                  onClick={handleInputClick}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm cursor-pointer"
                />
              </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center py-4 px-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-200 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:-translate-y-1 hover:shadow-xl active:scale-95 transition-all duration-300"
          >
            <FiPlus className="mr-2 text-2xl" /> Add Food Log
          </button>
        </form>

        {/* AI Result Area */}
        {aiResponse && (
          <div className={`mt-6 p-4 rounded-xl border animate-fade-in ${aiResponse.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            {aiResponse.error ? (
              <div className="flex items-center text-red-600 font-medium">
                  <FiInfo className="mr-2 text-lg" /> {aiResponse.error}
              </div>
            ) : (
              <div>
                <div className="flex items-center font-bold text-green-800 mb-1">
                  <FiCheckCircle className="mr-2 text-lg" /> AI Result Found
                </div>
                <div className="pl-7">
                    <div className="text-sm text-gray-700 font-semibold">{aiResponse.matched_name || 'No matched name'}</div>
                    {aiResponse.kcal_per_100g != null && (
                      <div className="mt-1 text-sm text-gray-600">
                          Estimated: <span className="font-bold text-green-600">{aiResponse.kcal_per_100g} kcal</span> per 100g
                      </div>
                    )}
                    <div className="mt-2 text-xs text-gray-400 flex items-center">
                        <FiInfo className="mr-1" /> Source: {aiResponse.source || 'unknown'}
                    </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default FoodLogForm;