const express = require('express');
const router = express.Router();
const sleepLogController = require('../controllers/sleepLogController');
const { protect } = require('../middleware/authMiddleware');

// Menambahkan log tidur baru untuk pengguna yang diautentikasi.
router.post('/', protect, sleepLogController.addSleepLog);
router.get('/', protect, sleepLogController.getSleepLogs);

module.exports = router;