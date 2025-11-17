import React, { useState, useEffect } from 'react';
import { useLog } from '../context/LogContext';
import { getReportData, getStatistics, getRecommendations } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function ReportPage() {
  const { foodLogs, exerciseLogs, sleepLogs } = useLog();
  const [reportData, setReportData] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Process data for charts from context (realtime)
  const processChartData = () => {
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    
    const dateRange = [...Array(days)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    // Food calories per day
    const foodCaloriesData = dateRange.map(date => {
      const dayLogs = foodLogs.filter(log => log.tanggal === date);
      return dayLogs.reduce((sum, log) => sum + (log.kalori || 0), 0);
    });

    // Exercise calories burned per day
    const exerciseCaloriesData = dateRange.map(date => {
      const dayLogs = exerciseLogs.filter(log => log.tanggal === date);
      return dayLogs.reduce((sum, log) => sum + (log.kalori_terbakar || 0), 0);
    });

    // Sleep hours per day
    const sleepHoursData = dateRange.map(date => {
      const dayLogs = sleepLogs.filter(log => log.tanggal === date);
      return dayLogs.reduce((sum, log) => {
        if (!log.waktu_tidur || !log.waktu_bangun) return sum;
        try {
          const sleepTime = new Date(log.waktu_tidur);
          const wakeTime = new Date(log.waktu_bangun);
          const hours = (wakeTime - sleepTime) / (1000 * 60 * 60);
          return sum + Math.max(0, Math.min(24, hours)); // Validate hours range
        } catch (error) {
          console.error('Error calculating sleep hours:', error);
          return sum;
        }
      }, 0);
    });

    // Activity distribution
    const activityDistribution = {
      food: foodLogs.length,
      exercise: exerciseLogs.length,
      sleep: sleepLogs.length
    };

    return {
      dateRange,
      foodCaloriesData,
      exerciseCaloriesData,
      sleepHoursData,
      activityDistribution
    };
  };

  // Fetch additional data from API
  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reportRes, statsRes, recRes] = await Promise.all([
        getReportData(timeRange),
        getStatistics(timeRange),
        getRecommendations({
          foodLogs: foodLogs.slice(-50), // Last 50 entries for context
          exerciseLogs: exerciseLogs.slice(-50),
          sleepLogs: sleepLogs.slice(-50),
          timeRange
        })
      ]);
      
      setReportData(reportRes.data);
      setStatistics(statsRes.data);
      setRecommendations(recRes.data || []);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Failed to load some report data. Showing available information...');
      // Set default recommendations if API fails
      setRecommendations(getDefaultRecommendations());
    } finally {
      setLoading(false);
    }
  };

  // Fallback recommendations if AI service is unavailable
  const getDefaultRecommendations = () => {
    const recs = [];
    
    // Analyze sleep patterns
    const avgSleep = sleepLogs.reduce((sum, log) => {
      if (log.waktu_tidur && log.waktu_bangun) {
        const sleepTime = new Date(log.waktu_tidur);
        const wakeTime = new Date(log.waktu_bangun);
        return sum + ((wakeTime - sleepTime) / (1000 * 60 * 60));
      }
      return sum;
    }, 0) / (sleepLogs.length || 1);

    if (avgSleep < 7) {
      recs.push({
        title: 'Improve Sleep Duration',
        description: 'Aim for 7-9 hours of sleep per night for better recovery and health.',
        type: 'sleep'
      });
    }

    // Analyze calorie balance
    const totalCaloriesIn = foodLogs.reduce((sum, log) => sum + (log.kalori || 0), 0);
    const totalCaloriesOut = exerciseLogs.reduce((sum, log) => sum + (log.kalori_terbakar || 0), 0);
    const netCalories = totalCaloriesIn - totalCaloriesOut;

    if (netCalories > 500) {
      recs.push({
        title: 'Balance Caloric Intake',
        description: 'Consider adjusting your diet or increasing physical activity to maintain energy balance.',
        type: 'nutrition'
      });
    }

    // Activity consistency
    if (foodLogs.length < 3) {
      recs.push({
        title: 'Track Meals Regularly',
        description: 'Log your meals consistently to get better insights into your eating patterns.',
        type: 'consistency'
      });
    }

    return recs.slice(0, 4); // Return max 4 recommendations
  };

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const chartData = processChartData();

  // Chart configurations
  const calorieComparisonChart = {
    labels: chartData.dateRange.map(date => {
      const dateObj = new Date(date);
      if (timeRange === 'week') {
        return dateObj.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
      } else if (timeRange === 'month') {
        return dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      } else {
        return dateObj.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
      }
    }),
    datasets: [
      {
        label: 'Calories Consumed',
        data: chartData.foodCaloriesData,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
      {
        label: 'Calories Burned',
        data: chartData.exerciseCaloriesData,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
      }
    ],
  };

  const sleepTrendChart = {
    labels: chartData.dateRange.map(date => {
      const dateObj = new Date(date);
      if (timeRange === 'week') {
        return dateObj.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
      } else if (timeRange === 'month') {
        return dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      } else {
        return dateObj.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
      }
    }),
    datasets: [
      {
        label: 'Sleep Hours',
        data: chartData.sleepHoursData,
        backgroundColor: 'rgba(168, 85, 247, 0.6)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const activityDistributionChart = {
    labels: ['Food Logs', 'Exercise Logs', 'Sleep Logs'],
    datasets: [
      {
        data: [
          chartData.activityDistribution.food,
          chartData.activityDistribution.exercise,
          chartData.activityDistribution.sleep
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(168, 85, 247)'
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Last ${timeRange === 'week' ? '7 Days' : timeRange === 'month' ? '30 Days' : 'Year'}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const getActivityType = (activity) => {
    if (activity.nama_makanan) return 'food';
    if (activity.nama_olahraga || activity.jenis_olahraga) return 'exercise';
    if (activity.waktu_tidur || activity.kualitas_tidur) return 'sleep';
    return 'unknown';
  };

  const getActivityDescription = (activity) => {
    const type = getActivityType(activity);
    switch (type) {
      case 'food':
        return `Ate ${activity.nama_makanan} (${activity.kalori || 0} kcal)`;
      case 'exercise':
        return `Did ${activity.nama_olahraga || activity.jenis_olahraga} (${activity.kalori_terbakar || 0} kcal burned)`;
      case 'sleep':
        return `Slept ${activity.kualitas_tidur ? `- ${activity.kualitas_tidur}` : ''}`;
      default:
        return 'Logged activity';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Report</h1>
            <p className="text-gray-600">AI-powered insights and overview of your health activities</p>
          </div>
          <div className="flex space-x-2">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  timeRange === range 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-yellow-600 text-sm">{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading AI-powered insights...</div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Food Logs</h3>
                <p className="text-3xl font-bold text-blue-600">{foodLogs.length}</p>
                <p className="text-sm text-gray-600">Meals recorded</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Exercise</h3>
                <p className="text-3xl font-bold text-green-600">{exerciseLogs.length}</p>
                <p className="text-sm text-gray-600">Workout sessions</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Sleep Records</h3>
                <p className="text-3xl font-bold text-purple-600">{sleepLogs.length}</p>
                <p className="text-sm text-gray-600">Nights tracked</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Net Calories</h3>
                <p className="text-3xl font-bold text-orange-600">
                  {foodLogs.reduce((sum, log) => sum + (log.kalori || 0), 0) - 
                   exerciseLogs.reduce((sum, log) => sum + (log.kalori_terbakar || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Current balance</p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Calorie Comparison Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Calorie Intake vs Burned</h3>
                <div className="h-80">
                  <Bar data={calorieComparisonChart} options={chartOptions} />
                </div>
              </div>

              {/* Sleep Trend Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Sleep Pattern</h3>
                <div className="h-80">
                  <Line data={sleepTrendChart} options={chartOptions} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Activity Distribution */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Activity Distribution</h3>
                <div className="h-64">
                  <Doughnut data={activityDistributionChart} options={doughnutOptions} />
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {[...foodLogs, ...exerciseLogs, ...sleepLogs]
                    .sort((a, b) => new Date(b.tanggal || b.createdAt) - new Date(a.tanggal || a.createdAt))
                    .slice(0, 8)
                    .map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <span className={`inline-block w-3 h-3 rounded-full mr-3 ${
                            getActivityType(activity) === 'food' ? 'bg-blue-500' : 
                            getActivityType(activity) === 'exercise' ? 'bg-green-500' : 'bg-purple-500'
                          }`}></span>
                          <span className="font-medium text-sm">
                            {getActivityDescription(activity)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.tanggal || activity.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* AI Recommendations Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md border border-blue-200">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">AI-Powered Recommendations</h3>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  Smart Analysis
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                Based on your activity patterns and health data, here are personalized suggestions to help you achieve your wellness goals.
              </p>
              
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start mb-2">
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded mr-2">
                          AI
                        </span>
                        <h4 className="font-semibold text-blue-800">{rec.title}</h4>
                      </div>
                      <p className="text-gray-700 text-sm">{rec.description}</p>
                      {rec.type && (
                        <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {rec.type}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No recommendations available. Continue logging your activities to get personalized AI suggestions.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReportPage;