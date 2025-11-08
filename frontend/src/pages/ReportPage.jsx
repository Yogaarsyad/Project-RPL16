// frontend/src/pages/ReportPage.jsx
import React, { useState, useEffect } from 'react';
import { getReportData, getStatistics } from '../services/api';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler, BarElement
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, Filler, BarElement
);

// --- Analysis Component ---
function AnalysisReport({ label, average, unit }) {
  // ... (kode AnalysisReport Anda tidak berubah)
  let analysis = "";
  if (label === 'Calories') {
    if (average > 2500) analysis = `Your average intake (${average.toLocaleString()} kcal) appears high. Consider lower-calorie food options.`;
    else if (average < 1800) analysis = `Your average intake (${average.toLocaleString()} kcal) is somewhat low. Make sure you're getting enough energy.`;
    else analysis = `You're maintaining your calorie intake (${average.toLocaleString()} kcal) very well. Keep it up!`;
  } else if (label === 'Sleep') {
    if (average > 9) analysis = `You're getting excellent average rest time (${average} hours). Great job!`;
    else if (average < 6) analysis = `Your average sleep (${average} hours) appears low. Try aiming for 7-8 hours per night.`;
    else analysis = `You're getting healthy average sleep (${average} hours). Consistency is key.`;
  } else if (label === 'Exercise') {
    if (average > 45) analysis = `You're very active with an average of ${average} minutes/day. Amazing! Make sure to get enough rest.`;
    else if (average < 15) analysis = `Your average activity (${average} minutes/day) is still low. Try adding a 20-minute walk every day.`;
    else analysis = `You're consistent with exercise (${average} minutes/day). This is a great habit!`;
  }
  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg animate-fade-in">
      <p className="text-sm text-gray-700">
        <strong>Analysis:</strong> {analysis}
      </p>
    </div>
  );
}

// --- StatCard Component ---
function StatCard({ title, value, unit, icon, color }) {
  // ... (kode StatCard Anda tidak berubah)
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    if (typeof val === 'string') {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        return num.toLocaleString();
      }
      return val;
    }
    if (typeof val === 'object' && val !== null) {
      // Coba akses properti 'value', 'total', atau ambil angka pertama
      const num = val.value || val.total || Object.values(val).find(v => typeof v === 'number');
      if (num !== undefined) {
        return num.toLocaleString();
      }
      return '0';
    }
    return '0';
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${color}`}>
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${color.replace('border-l-', 'bg-').replace('-400', '-100')} mr-3`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">
            {formatValue(value)} <span className="text-sm font-normal">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
}


// --- AI Assistant Placeholder ---
function AIPlaceholder() {
  // ... (kode AIPlaceholder Anda tidak berubah)
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border-2 border-dashed border-purple-200 text-center animate-pulse">
      <div className="flex items-center justify-center mb-3">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
          <span className="text-purple-600 text-lg">🤖</span>
        </div>
        <h3 className="text-lg font-semibold text-purple-800">AI Health Assistant</h3>
      </div>
      <p className="text-purple-600 mb-4">Coming Soon: Intelligent analysis and personalized recommendations</p>
      <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
        <span className="animate-pulse">🔄</span>
        <span className="ml-2">AI Features Loading...</span>
      </div>
    </div>
  );
}

function ReportPage() {
  // State for 3 types of data
  const [foodData, setFoodData] = useState({});
  const [sleepData, setSleepData] = useState({});
  const [exerciseData, setExerciseData] = useState({});
  
  // State for analysis data
  const [foodStats, setFoodStats] = useState({ avg: 0, data: [], total: 0 });
  const [sleepStats, setSleepStats] = useState({ avg: 0, data: [] });
  const [exerciseStats, setExerciseStats] = useState({ avg: 0, data: [] });
  
  // State for overall statistics
  const [overallStats, setOverallStats] = useState({});
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reportResponse, statsResponse] = await Promise.all([
          getReportData(),
          getStatistics()
        ]);
        
        if (reportResponse.data.success) {
          // Process and set all data
          processCalorieData(reportResponse.data.data.foodLogs);
          processSleepData(reportResponse.data.data.sleepLogs);
          processExerciseData(reportResponse.data.data.exerciseLogs);
        }
        
        if (statsResponse.data.success) {
          setOverallStats(statsResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to process calorie data
  const processCalorieData = (logs) => {
    const aggregatedData = logs.reduce((acc, log) => {
      const date = new Date(log.tanggal).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
      acc[date] = (acc[date] || 0) + Number(log.kalori);
      return acc;
    }, {});

    const labels = Object.keys(aggregatedData);
    const data = Object.values(aggregatedData);
    const total = data.reduce((sum, val) => sum + val, 0);
    const avg = data.length > 0 ? Math.round(total / data.length) : 0;
    
    // PERBAIKAN DARI SEBELUMNYA: Pastikan 'total' juga disimpan
    setFoodStats({ avg, data, total }); // <- 'total' sudah ada di sini
    
    setFoodData({
      labels: labels,
      datasets: [{
        label: 'Daily Calories (kcal)',
        data: data,
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        fill: true, 
        tension: 0.4
      }]
    });
  };

  // Function to process sleep data
  const processSleepData = (logs) => {
    // ... (kode processSleepData Anda tidak berubah)
    const aggregatedData = logs.reduce((acc, log) => {
      const date = new Date(log.tanggal).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
      const sleepTime = new Date(log.waktu_tidur);
      const wakeTime = new Date(log.waktu_bangun);
      const hoursSlept = (wakeTime - sleepTime) / (1000 * 60 * 60);
      acc[date] = (acc[date] || 0) + hoursSlept;
      return acc;
    }, {});

    const labels = Object.keys(aggregatedData);
    const data = Object.values(aggregatedData).map(hours => hours.toFixed(1));
    const total = data.reduce((sum, val) => sum + parseFloat(val), 0);
    const avg = data.length > 0 ? (total / data.length).toFixed(1) : 0;
    
    setSleepStats({ avg, data });
    setSleepData({
      labels: labels,
      datasets: [{
        label: 'Sleep Hours (hours)',
        data: data,
        borderColor: 'rgb(22, 163, 74)',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        borderWidth: 2,
        fill: true, 
        tension: 0.4
      }]
    });
  };

  // Function to process exercise data
  const processExerciseData = (logs) => {
    // ... (kode processExerciseData Anda tidak berubah)
    const aggregatedData = logs.reduce((acc, log) => {
      const date = new Date(log.tanggal).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
      acc[date] = (acc[date] || 0) + Number(log.durasi_menit);
      return acc;
    }, {});

    const labels = Object.keys(aggregatedData);
    const data = Object.values(aggregatedData);
    const total = data.reduce((sum, val) => sum + val, 0);
    const avg = data.length > 0 ? Math.round(total / data.length) : 0;
    
    setExerciseStats({ avg, data });
    setExerciseData({
      labels: labels,
      datasets: [{
        label: 'Exercise Minutes (minutes)',
        data: data,
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        borderWidth: 2,
        fill: true, 
        tension: 0.4
      }]
    });
  };

  const chartOptions = {
    // ... (kode chartOptions Anda tidak berubah)
    responsive: true,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15
        }
      },
      title: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  if (loading) {
    // ... (kode loading Anda tidak berubah)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
         title="Total Calories" 
        value={foodStats.total || 0} // Menggunakan total dari foodStats
        unit="kcal" 
        icon="🔥" 
        color="border-l-red-400"
        />

        <StatCard 
          title="Average Sleep" 
          value={overallStats.averageSleepHours || 0} 
          unit="hours" 
          icon="😴" 
          color="border-l-green-400"
        />
        <StatCard 
          title="Total Exercise" 
          value={overallStats.totalExerciseMinutes || 0} 
          unit="minutes" 
          icon="💪" 
          color="border-l-yellow-400"
        />
        <StatCard 
          title="Exercise Sessions" 
          value={overallStats.totalExerciseSessions || 0} 
          unit="sessions" 
          icon="📊" 
          color="border-l-purple-400"
        />
      </div>

      {/* AI Assistant Placeholder */}
      <AIPlaceholder />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Calorie Intake Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          {/* ... (kode Calorie Intake Chart Anda tidak berubah) */}
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Weekly Calorie Intake</h3>
          {foodStats.data.length > 0 ? (
            <>
              <div className="h-64">
                <Line data={foodData} options={chartOptions} />
              </div>
              <AnalysisReport label="Calories" average={foodStats.avg} />
            </>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-400 text-center">No calorie data recorded for the past 7 days.</p>
            </div>
          )}
        </div>
        
        {/* Sleep Duration Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          {/* ... (kode Sleep Duration Chart Anda tidak berubah) */}
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Weekly Sleep Duration</h3>
          {sleepStats.data.length > 0 ? (
            <>
              <div className="h-64">
                <Line data={sleepData} options={chartOptions} />
              </div>
              <AnalysisReport label="Sleep" average={sleepStats.avg} />
            </>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-400 text-center">No sleep data recorded for the past 7 days.</p>
            </div>
          )}
        </div>

        {/* Exercise Activity Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md md:col-span-2">
          {/* ... (kode Exercise Activity Chart Anda tidak berubah) */}
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Weekly Exercise Activity</h3>
          {exerciseStats.data.length > 0 ? (
            <>
              <div className="h-64">
                <Line data={exerciseData} options={chartOptions} />
              </div>
              <AnalysisReport label="Exercise" average={exerciseStats.avg} />
              
              {/* Additional Info */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p className="font-semibold text-yellow-800">Total Calories Burned</p>
                  <p className="text-xl font-bold text-yellow-900">{(overallStats.totalCaloriesBurned || 0).toLocaleString()} kcal</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="font-semibold text-blue-800">Average per Session</p>
                  <p className="text-xl font-bold text-blue-900">{(overallStats.averageExerciseMinutes || 0).toLocaleString()} minutes</p>
                </div>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-400 text-center">No exercise data recorded for the past 7 days.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportPage;