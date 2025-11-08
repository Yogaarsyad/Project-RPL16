const express = require('express');
const router = express.Router();
const exerciseLogController = require('../controllers/exerciseLogController');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to individual routes
router.post('/', protect, exerciseLogController.addLog);
router.get('/', protect, exerciseLogController.getLogs);

module.exports = router;