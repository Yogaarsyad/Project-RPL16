const sleepLogModel = require('../models/sleepLogModel');

// Controller untuk menambahkan dan mendapatkan log tidur.
exports.addSleepLog = async (req, res) => {
  const { tanggal, waktu_tidur, waktu_bangun, kualitas_tidur } = req.body;
  const userId = req.user.id;
  try {
    const log = await sleepLogModel.createSleepLog(userId, tanggal, waktu_tidur, waktu_bangun, kualitas_tidur);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add sleep log' });
  }
};

exports.getSleepLogs = async (req, res) => {
  const userId = req.user.id;
  try {
    const logs = await sleepLogModel.getSleepLogsByUserId(userId);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sleep logs' });
  }
};