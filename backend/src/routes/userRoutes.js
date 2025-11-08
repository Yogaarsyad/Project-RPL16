const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const profileController = require('../controllers/userProfileController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', protect, profileController.getProfile);
router.put('/profile', protect, profileController.updateProfile);

module.exports = router;