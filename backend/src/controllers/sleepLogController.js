const SleepLog = require('../models/SleepLog');

exports.getSleepLogs = async (req, res) => {
  try {
    const sleepLogs = await SleepLog.find({ user: req.user.id });
    res.json(sleepLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSleepLog = async (req, res) => {
  const { tanggal, waktu_tidur, waktu_bangun, kualitas_tidur } = req.body;
  try {
    const sleepLog = new SleepLog({
      user: req.user.id,
      tanggal,
      waktu_tidur,
      waktu_bangun,
      kualitas_tidur
    });
    await sleepLog.save();
    res.status(201).json(sleepLog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSleepLog = async (req, res) => {
  try {
    const sleepLog = await SleepLog.findById(req.params.id);
    if (!sleepLog) {
      return res.status(404).json({ message: 'Sleep log not found' });
    }
    if (sleepLog.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await SleepLog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sleep log removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};