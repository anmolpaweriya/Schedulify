const express = require('express');
const {
  getUsers,
  getProviders,
  getUser,
  updateProfile,
  getProviderAvailability,
  updateAvailability,
} = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', protect, authorizeRoles('Admin', 'Receptionist', 'University Coordinator'), getUsers);
router.get('/providers', getProviders);
router.get('/providers/:id/availability', getProviderAvailability);
router.get('/:id', protect, getUser);

router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/availability', protect, authorizeRoles('Provider'), updateAvailability);

module.exports = router;
