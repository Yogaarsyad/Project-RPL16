const jwt = require('jsonwebtoken');

// Middleware untuk melindungi rute dengan otentikasi JWT.
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Menambahkan payload token (berisi id user) ke request
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token tidak valid, otorisasi gagal.' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Tidak ada token, otorisasi gagal.' });
  }
};

module.exports = { protect };