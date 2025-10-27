import React, { useState } from 'react';
import { checkCalories } from '../services/api';

function FoodLogForm({ onAddLog }) {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [checking, setChecking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send correct field names to backend
    onAddLog({ nama_makanan: foodName, kalori: parseInt(calories), tanggal: date });
    setFoodName('');
    setCalories('');
    setDate('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Log New Food</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Food Name</label>
          <div className="mt-1 flex">
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="e.g., Fried Rice"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={async () => {
                // trigger AI/calorie lookup
                if (!foodName.trim()) return;
                try {
                  setChecking(true);
                  setAiResponse(null);
                  const res = await checkCalories(foodName.trim());
                  // Fill calorie input with returned kcal_per_100g (user can adjust)
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
              className="ml-2 inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 rounded-r-md hover:bg-gray-100"
            >
              {checking ? 'Searching...' : 'Check calories'}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Calories (kcal)</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="e.g., 450"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Log
        </button>
      </form>
      {/* AI result area */}
      <div className="mt-4">
        {aiResponse && (
          <div className="bg-gray-50 p-4 rounded-md border">
            {aiResponse.error ? (
              <div className="text-red-600">{aiResponse.error}</div>
            ) : (
              <div>
                <div className="font-medium">AI result</div>
                <div className="text-sm text-gray-700">{aiResponse.matched_name || 'No matched name'}</div>
                {aiResponse.kcal_per_100g != null && (
                  <div className="mt-2">Estimated: <span className="font-semibold">{aiResponse.kcal_per_100g} kcal</span> per 100g</div>
                )}
                <div className="mt-1 text-xs text-gray-500">Source: {aiResponse.source || 'unknown'}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodLogForm;