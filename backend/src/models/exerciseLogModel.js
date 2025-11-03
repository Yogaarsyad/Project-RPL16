// backend/src/models/exerciseLogModel.js

const db = require('../config/db');

/**
 * Membuat catatan olahraga baru untuk seorang pengguna.
 * @param {number} userId ID pengguna.
 * @param {object} logData Data log olahraga { nama_olahraga, durasi_menit, kalori_terbakar, tanggal }.
 * @returns {Promise<object>} Catatan log yang baru dibuat.
 */
const create = async (userId, { nama_olahraga, jenis_olahraga, durasi_menit, kalori_terbakar, tanggal }) => {
    // Accept either `nama_olahraga` or `jenis_olahraga` from caller, but INSERT into DB column `jenis_olahraga`
    const sportName = nama_olahraga || jenis_olahraga || null;
    // Query SQL untuk memasukkan data baru ke tabel exercise_logs
    const result = await db.query(
        'INSERT INTO exercise_logs (user_id, jenis_olahraga, durasi_menit, kalori_terbakar, tanggal) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [userId, sportName, durasi_menit, kalori_terbakar, tanggal || new Date()]
    );
    return result.rows[0];
};

/**
 * Mengambil semua catatan olahraga milik seorang pengguna.
 * @param {number} userId ID pengguna.
 * @returns {Promise<Array>} Daftar log olahraga.
 */
const getByUserId = async (userId) => {
    // Query SQL untuk mengambil semua data dari exercise_logs berdasarkan user_id
    const result = await db.query('SELECT * FROM exercise_logs WHERE user_id = $1 ORDER BY tanggal DESC', [userId]);
    return result.rows;
};

// Ekspor fungsi-fungsi agar bisa digunakan oleh controller
module.exports = {
    create,
    getByUserId,
};