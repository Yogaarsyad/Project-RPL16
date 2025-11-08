// frontend/src/pages/ReportPage.jsx
import React, { useState, useEffect } from 'react';
import { getReportData } from '../services/api'; // Memanggil API yang benar
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, Filler
);

// --- Komponen Analisis ---
function AnalysisReport({ label, average, unit }) {
  let analysis = "";
  if (label === 'Kalori') {
    if (average > 2500) analysis = `Rata-rata asupan Anda (${average} kkal) terlihat tinggi. Coba pertimbangkan opsi makanan yang lebih rendah kalori.`;
    else if (average < 1800) analysis = `Rata-rata asupan Anda (${average} kkal) agak rendah. Pastikan Anda mendapatkan energi yang cukup.`;
    else analysis = `Anda menjaga asupan kalori (${average} kkal) dengan sangat baik. Pertahankan!`;
  } else if (label === 'Tidur') {
    if (average > 9) analysis = `Anda mendapatkan waktu istirahat rata-rata (${average} jam) yang sangat baik. Kerja bagus!`;
    else if (average < 6) analysis = `Rata-rata tidur Anda (${average} jam) terlihat rendah. Coba targetkan 7-8 jam per malam.`;
    else analysis = `Anda mendapatkan rata-rata tidur (${average} jam) yang sehat. Konsistensi adalah kunci.`;
  } else if (label === 'Olahraga') {
    if (average > 45) analysis = `Anda sangat aktif dengan rata-rata ${average} menit/hari. Luar biasa! Pastikan istirahat cukup.`;
    else if (average < 15) analysis = `Rata-rata aktivitas Anda (${average} menit/hari) masih rendah. Coba tambahkan jalan santai 20 menit setiap hari.`;
    else analysis = `Anda konsisten berolahraga (${average} menit/hari). Ini adalah kebiasaan yang hebat!`;
  }
  return <p className="text-sm text-gray-600 mt-4"><strong>Analisis:</strong> {analysis}</p>;
}
// --- Akhir Komponen Analisis ---

function ReportPage() {
  // State untuk 3 jenis data
  const [foodData, setFoodData] = useState({});
  const [sleepData, setSleepData] = useState({});
  const [exerciseData, setExerciseData] = useState({});
  
  // State untuk data analisis
  const [foodStats, setFoodStats] = useState({ avg: 0, data: [] });
  const [sleepStats, setSleepStats] = useState({ avg: 0, data: [] });
  const [exerciseStats, setExerciseStats] = useState({ avg: 0, data: [] });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getReportData(); // Panggil API Laporan
        
        if (response.data.success) {
          // Proses dan set semua data
          processCalorieData(response.data.data.foodLogs);
          processSleepData(response.data.data.sleepLogs);
          processExerciseData(response.data.data.exerciseLogs); // Panggil fungsi baru
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fungsi untuk memproses data kalori
  const processCalorieData = (logs) => {
    const aggregatedData = logs.reduce((acc, log) => {
      const date = new Date(log.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      acc[date] = (acc[date] || 0) + Number(log.kalori);
      return acc;
    }, {});

    const labels = Object.keys(aggregatedData);
    const data = Object.values(aggregatedData);
    const total = data.reduce((sum, val) => sum + val, 0);
    const avg = data.length > 0 ? Math.round(total / data.length) : 0;
    
    setFoodStats({ avg, data });
    setFoodData({
      labels: labels,
      datasets: [{
        label: 'Kalori Harian (kkal)',
        data: data,
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        fill: true, tension: 0.3
      }]
    });
  };




  // Fungsi untuk memproses data tidur
  const processSleepData = (logs) => {
    const aggregatedData = logs.reduce((acc, log) => {
      const date = new Date(log.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
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
        label: 'Jam Tidur (jam)',
        data: data,
        borderColor: 'rgb(22, 163, 74)',
        backgroundColor: 'rgba(22, 163, 74, 0.2)',
        fill: true, tension: 0.3
      }]
    });
  };

  // --- FUNGSI BARU UNTUK OLAHRAGA ---
  const processExerciseData = (logs) => {
    const aggregatedData = logs.reduce((acc, log) => {
      const date = new Date(log.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
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
        label: 'Menit Olahraga (menit)',
        data: data,
        borderColor: 'rgb(234, 179, 8)', // Warna Kuning
        backgroundColor: 'rgba(234, 179, 8, 0.2)',
        fill: true, tension: 0.3
      }]
    });
  };
  // --- AKHIR FUNGSI BARU ---

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
      
      {/* Grafik Asupan Kalori */}
      <div className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Weekly Calorie Intake</h3>
        {foodStats.data.length > 0 ? (
          <>
            <Line data={foodData} options={chartOptions} />
            <AnalysisReport label="Kalori" average={foodStats.avg} />
          </>
        ) : (
          <p className="text-gray-500 text-center py-10">No calorie data recorded for the past 7 days.</p>
        )}
      </div>
      
      {/* Grafik Durasi Tidur */}
      <div className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Weekly Sleep Summary</h3>
        {sleepStats.data.length > 0 ? (
          <>
            <Line data={sleepData} options={chartOptions} />
            <AnalysisReport label="Tidur" average={sleepStats.avg} />
          </>
        ) : (
          <p className="text-gray-500 text-center py-10">No sleep data recorded for the past 7 days.</p>
        )}
      </div>

      {/* --- KARTU GRAFIK BARU UNTUK OLAHRAGA --- */}
      <div className="bg-white p-6 rounded-lg shadow-md transition-shadow hover:shadow-xl md:col-span-2">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Weekly Exercise Summary</h3>
        {exerciseStats.data.length > 0 ? (
          <>
            <Line data={exerciseData} options={chartOptions} />
            <AnalysisReport label="Olahraga" average={exerciseStats.avg} />
          </>
        ) : (
          <p className="text-gray-500 text-center py-10">No exercise data recorded for the past 7 days.</p>
        )}
      </div>
      {
        
      }

    </div>
  );
}

export default ReportPage;