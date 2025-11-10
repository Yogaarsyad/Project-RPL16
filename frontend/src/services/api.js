import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Menyisipkan token otentikasi ke setiap permintaan API.
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- User & Profile ---
export const register = (formData) => API.post('/users/register', formData);
export const login = (formData) => API.post('/users/login', formData);
export const getProfile = () => API.get('/users/profile');
export const updateProfile = (profileData) => API.put('/users/profile', profileData);

// --- Food Log ---
export const addFoodLog = (logData) => API.post('/food-logs', logData);
export const getFoodLogs = () => API.get('/food-logs');
export const deleteFoodLog = (logId) => API.delete(`/food-logs/${logId}`);
export const checkCalories = (name) => API.post('/food-logs/calories', { name });

// --- Exercise Log ---
export const getExerciseLogs = () => API.get('/exercise-logs');
export const addExerciseLog = (logData) => API.post('/exercise-logs', logData);
export const deleteExerciseLog = (logId) => API.delete(`/exercise-logs/${logId}`);

// --- Sleep Log ---
export const addSleepLog = (logData) => API.post('/sleep-logs', logData);
export const getSleepLogs = () => API.get('/sleep-logs');
export const deleteSleepLog = (logId) => API.delete(`/sleep-logs/${logId}`);

// --- Report & Recommendation ---
export const getReportData = () => API.get('/laporan/data'); 
export const getStatistics = () => API.get('/laporan/statistics');
export const getRecommendations = () => API.get('/recommendations');
export const getExerciseTrend = () => API.get('/laporan/exercise-trend');