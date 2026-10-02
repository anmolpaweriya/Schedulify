const express = require('express');
const { getNotifications, markRead, markAllRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/', getNotifications);
router.put('/read-all', markAllRead);
router.put('/:id/read', markRead);

module.exports = router;
