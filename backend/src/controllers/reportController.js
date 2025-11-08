const foodLogModel = require('../models/foodLogModel');
const sleepLogModel = require('../models/sleepLogModel');
const exerciseLogModel = require('../models/exerciseLogModel');

// Controller untuk mendapatkan data laporan gabungan.
exports.getReportData = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // Mengambil semua data log dalam satu panggilan.
    const [foodLogs, sleepLogs, exerciseLogs] = await Promise.all([
      foodLogModel.getFoodLogsByUserId(userId),
      sleepLogModel.getSleepLogsByUserId(userId),
      exerciseLogModel.getExerciseLogsByUserId(userId) 
    ]);

    // Filter data untuk 7 hari terakhir
    const filteredFoodLogs = foodLogs.filter(log => 
      new Date(log.tanggal) >= sevenDaysAgo
    );
    const filteredSleepLogs = sleepLogs.filter(log => 
      new Date(log.tanggal) >= sevenDaysAgo
    );
    const filteredExerciseLogs = exerciseLogs.filter(log => 
      new Date(log.tanggal) >= sevenDaysAgo
    );

    // Menyusun respons
    res.json({
      success: true,
      data: {
        foodLogs: filteredFoodLogs,
        sleepLogs: filteredSleepLogs,
        exerciseLogs: filteredExerciseLogs,
        period: {
          start: sevenDaysAgo,
          end: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Error in getReportData:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil data laporan'
    });
  }
};

// Controller untuk mendapatkan ringkasan statistik
exports.getStatistics = async (req, res) => {
  try {
    const userId = req.user.id;
    const [foodLogs, sleepLogs, exerciseLogs] = await Promise.all([
      foodLogModel.getFoodLogsByUserId(userId),
      sleepLogModel.getSleepLogsByUserId(userId),
      exerciseLogModel.getExerciseLogsByUserId(userId)
    ]);

    // Hitung statistik
    const stats = {
      totalCalories: foodLogs.reduce((sum, log) => sum + Number(log.kalori), 0),
      averageSleepHours: calculateAverageSleepHours(sleepLogs),

      totalExerciseMinutes: exerciseLogs.reduce((sum, log) => sum + Number(log.durasi_menit), 0)
      
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getStatistics:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil statistik'
    });
  }
};

// Fungsi helper untuk menghitung rata-rata jam tidur
function calculateAverageSleepHours(sleepLogs) {
  if (sleepLogs.length === 0) return 0;
  
  const totalHours = sleepLogs.reduce((sum, log) => {
    const sleepTime = new Date(log.waktu_tidur);
    const wakeTime = new Date(log.waktu_bangun);
    const hours = (wakeTime - sleepTime) / (1000 * 60 * 60);
    return sum + hours;
  }, 0);
  
  return totalHours / sleepLogs.length;
}

module.exports = exports;
