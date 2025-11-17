import React, { createContext, useState, useContext, useEffect } from 'react';

const LogContext = createContext();

export const useLog = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLog must be used within LogProvider');
  }
  return context;
};

export const LogProvider = ({ children }) => {
  const [foodLogs, setFoodLogs] = useState([]);
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [sleepLogs, setSleepLogs] = useState([]);

  // Load data dari localStorage saat app start
  useEffect(() => {
    const savedFoodLogs = localStorage.getItem('foodLogs');
    const savedExerciseLogs = localStorage.getItem('exerciseLogs');
    const savedSleepLogs = localStorage.getItem('sleepLogs');

    if (savedFoodLogs) setFoodLogs(JSON.parse(savedFoodLogs));
    if (savedExerciseLogs) setExerciseLogs(JSON.parse(savedExerciseLogs));
    if (savedSleepLogs) setSleepLogs(JSON.parse(savedSleepLogs));
  }, []);

  // Save data ke localStorage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem('foodLogs', JSON.stringify(foodLogs));
  }, [foodLogs]);

  useEffect(() => {
    localStorage.setItem('exerciseLogs', JSON.stringify(exerciseLogs));
  }, [exerciseLogs]);

  useEffect(() => {
    localStorage.setItem('sleepLogs', JSON.stringify(sleepLogs));
  }, [sleepLogs]);

  const addFoodLog = (log) => {
    const newLog = {
      id: Date.now(),
      type: 'food',
      ...log,
      createdAt: new Date().toISOString()
    };
    setFoodLogs(prev => [newLog, ...prev]);
  };

  const addExerciseLog = (log) => {
    const newLog = {
      id: Date.now(),
      type: 'exercise',
      ...log,
      createdAt: new Date().toISOString()
    };
    setExerciseLogs(prev => [newLog, ...prev]);
  };

  const addSleepLog = (log) => {
    const newLog = {
      id: Date.now(),
      type: 'sleep',
      ...log,
      createdAt: new Date().toISOString()
    };
    setSleepLogs(prev => [newLog, ...prev]);
  };

  const deleteFoodLog = (id) => {
    setFoodLogs(prev => prev.filter(log => log.id !== id));
  };

  const deleteExerciseLog = (id) => {
    setExerciseLogs(prev => prev.filter(log => log.id !== id));
  };

  const deleteSleepLog = (id) => {
    setSleepLogs(prev => prev.filter(log => log.id !== id));
  };

  const getAllActivities = () => {
    const allActivities = [
      ...foodLogs.map(log => ({ ...log, type: 'food' })),
      ...exerciseLogs.map(log => ({ ...log, type: 'exercise' })),
      ...sleepLogs.map(log => ({ ...log, type: 'sleep' }))
    ];
    return allActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

 // Additional utility functions for reports
  const getWeeklySummary = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date,
      foodCalories: foodLogs.filter(log => log.tanggal === date).reduce((sum, log) => sum + (log.kalori || 0), 0),
      exerciseCalories: exerciseLogs.filter(log => log.tanggal === date).reduce((sum, log) => sum + (log.kalori_terbakar || 0), 0),
      sleepHours: sleepLogs.filter(log => log.tanggal === date).reduce((sum, log) => {
        if (!log.waktu_tidur || !log.waktu_bangun) return sum;
        const sleepTime = new Date(log.waktu_tidur);
        const wakeTime = new Date(log.waktu_bangun);
        const hours = (wakeTime - sleepTime) / (1000 * 60 * 60);
        return sum + (hours || 0);
      }, 0)
    }));
  };

  const getActivityStats = () => ({
    totalFoodLogs: foodLogs.length,
    totalExerciseLogs: exerciseLogs.length,
    totalSleepLogs: sleepLogs.length,
    totalCaloriesConsumed: foodLogs.reduce((sum, log) => sum + (log.kalori || 0), 0),
    totalCaloriesBurned: exerciseLogs.reduce((sum, log) => sum + (log.kalori_terbakar || 0), 0),
    netCalories: foodLogs.reduce((sum, log) => sum + (log.kalori || 0), 0) - 
                exerciseLogs.reduce((sum, log) => sum + (log.kalori_terbakar || 0), 0)
  });

  const value = {
    foodLogs,
    exerciseLogs,
    sleepLogs,
    addFoodLog,
    addExerciseLog,
    addSleepLog,
    deleteFoodLog,
    deleteExerciseLog,
    deleteSleepLog,
    getAllActivities,
    getWeeklySummary, // Add new functions
    getActivityStats   // Add new functions
  };

  return (
    <LogContext.Provider value={value}>
      {children}
    </LogContext.Provider>
  );
};