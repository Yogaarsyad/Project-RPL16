const db = require('../config/db');

// Membuat log tidur baru.
const createSleepLog = async (userId, tanggal, waktu_tidur, waktu_bangun, kualitas_tidur) => {
  const result = await db.query(
    `INSERT INTO sleep_logs 
      (user_id, tanggal, waktu_tidur, waktu_bangun, kualitas_tidur) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, tanggal, waktu_tidur, waktu_bangun, kualitas_tidur]
  );
  return result.rows[0];
};

const getSleepLogsByUserId = async (userId) => {
  const result = await db.query(
      'SELECT * FROM sleep_logs WHERE user_id = $1 ORDER BY tanggal DESC',
      [userId]
    );
    return result.rows;
};

module.exports = { createSleepLog, getSleepLogsByUserId };