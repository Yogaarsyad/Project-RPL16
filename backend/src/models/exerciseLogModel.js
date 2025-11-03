// backend/src/models/exerciseLogModel.js
const db = require('../config/db');

// Ganti nama 'create' menjadi 'createExerciseLog'
const createExerciseLog = async (userId, nama_olahraga, durasi_menit, kalori_terbakar, tanggal) => {
  const result = await db.query(
    'INSERT INTO exercise_logs (user_id, nama_olahraga, durasi_menit, kalori_terbakar, tanggal) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, nama_olahraga, durasi_menit, kalori_terbakar, tanggal || new Date()]
  );
  return result.rows[0];
};

// Ganti nama 'getByUserId' menjadi 'getExerciseLogsByUserId'
const getExerciseLogsByUserId = async (userId) => {
  const result = await db.query('SELECT * FROM exercise_logs WHERE user_id = $1 ORDER BY tanggal DESC', [userId]);
  return result.rows;
};

// Pastikan Anda juga mengekspor nama baru
module.exports = {
  createExerciseLog,
  getExerciseLogsByUserId 
};