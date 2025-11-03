const express = require('express');
const router = express.Router();
const db = require('../config/db');



const createExerciseLog = async (userId, nama_olahraga, durasi_menit, kalori_terbakar, tanggal) => {
  const result = await db.query(
    'INSERT INTO exercise_logs (user_id, nama_olahraga, durasi_menit, kalori_terbakar, tanggal) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [userId, nama_olahraga, durasi_menit, kalori_terbakar, tanggal || new Date()]
  );
  return result.rows[0];
};


const getExerciseLogsByUserId = async (userId) => {
  const result = await db.query('SELECT * FROM exercise_logs WHERE user_id = $1 ORDER BY tanggal DESC', [userId]);
  return result.rows;
};

module.exports = router; 