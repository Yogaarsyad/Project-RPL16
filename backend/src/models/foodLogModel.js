const db = require('../config/db');

// Membuat log makanan baru.  
const createFoodLog = async (userId, nama_makanan, kalori, tanggal) => {
  const result = await db.query(
    'INSERT INTO food_logs (user_id, nama_makanan, kalori, tanggal) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, nama_makanan, kalori, tanggal]
  );
  return result.rows[0];
};

const getFoodLogsByUserId = async (userId) => {
  const result = await db.query('SELECT * FROM food_logs WHERE user_id = $1 ORDER BY tanggal DESC', [userId]);
  return result.rows;
};

module.exports = { createFoodLog, getFoodLogsByUserId };