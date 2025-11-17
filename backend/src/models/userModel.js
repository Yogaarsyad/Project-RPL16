// backend/src/models/userModel.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Fungsi untuk membuat pengguna baru.
const createUser = async (nama, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    'INSERT INTO users (nama, email, password) VALUES ($1, $2, $3) RETURNING id, email, nama',
    [nama, email, hashedPassword]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

// ▼▼▼ FUNGSI BARU YANG DITAMBAHKAN ▼▼▼

/**
 * Mencari pengguna berdasarkan ID (penting untuk middleware otentikasi)
 */
const findUserById = async (id) => {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

/**
 * Meng-update data di tabel users
 */
async function updateUser(userId, userData) {
    try {
        const { nama, npm, jurusan, email } = userData;
        const query = `
            UPDATE users 
            SET nama = $1, npm = $2, jurusan = $3, email = $4
            WHERE id = $5
            RETURNING id, nama, email, npm, jurusan
        `;
        const { rows } = await db.query(query, [nama, npm, jurusan, email, userId]);
        return rows[0];
    } catch (error) {
        throw new Error(`Failed to update user: ${error.message}`);
    }
}
// ▲▲▲ AKHIR FUNGSI BARU ▲▲▲


module.exports = { 
  createUser, 
  findUserByEmail,
  findUserById, // <-- Tambahkan export
  updateUser      // <-- Tambahkan export
};