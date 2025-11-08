const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { nama, email, password } = req.body;
  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar.' });
    }
    const user = await userModel.createUser(nama, email, password);
    res.status(201).json({ message: 'Registrasi berhasil', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Email atau password salah.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau password salah.' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, nama: user.nama, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};