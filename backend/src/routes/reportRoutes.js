const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// Pastikan controller Anda memiliki fungsi 'getReportData' dan 'getStatistics'
router.get('/data', protect, reportController.getReportData);
router.get('/statistics', protect, reportController.getStatistics);

module.exports = router;