import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

// Fungsi untuk User
export const register = (formData) => API.post('/users/register', formData);
export const login = (formData) => API.post('/users/login', formData);
export const getProfile = () => API.get('/users/profile');
export const updateProfile = (profileData) => API.put('/users/profile', profileData);

// Fungsi untuk Food Log
export const addFoodLog = (logData) => API.post('/food-logs', logData);
export const getFoodLogs = () => API.get('/food-logs');
<<<<<<< Updated upstream
// Exercise logs
export const addExerciseLog = (logData) => API.post('/exercise-logs', logData);
export const getExerciseLogs = () => API.get('/exercise-logs');
// Cari kalori berdasarkan nama makanan (backend akan memanggil OpenFoodFacts)
=======
export const deleteFoodLog = (logId) => API.delete(`/food-logs/${logId}`);
>>>>>>> Stashed changes
export const checkCalories = (name) => API.post('/food-logs/calories', { name });

// Fungsi untuk Sleep Log
export const addSleepLog = (logData) => API.post('/sleep-logs', logData);
export const getSleepLogs = () => API.get('/sleep-logs');

// --- TAMBAHKAN FUNGSI INI ---
// Fungsi untuk Laporan
export const getReportData = () => API.get('/laporan/data');
export const getStatistics = () => API.get('/laporan/statistics');