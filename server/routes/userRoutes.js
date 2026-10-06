const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

router.get('/settings', requireAuth, userController.getSettings);
router.put('/settings', requireAuth, userController.updateSettings);
router.get('/profile', requireAuth, userController.getProfile);

module.exports = router;
