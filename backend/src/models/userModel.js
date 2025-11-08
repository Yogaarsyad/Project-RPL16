
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

module.exports = { createUser, findUserByEmail };