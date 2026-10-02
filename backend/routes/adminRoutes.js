const express = require('express');
const {
  getSettings,
  updateSettings,
  getPendingProviders,
  approveProvider,
  updateUser,
  deleteUser,
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes require authentication

router.get('/settings', authorizeRoles('Admin'), getSettings);
router.put('/settings', authorizeRoles('Admin'), updateSettings);

router.get('/providers/pending', authorizeRoles('Admin', 'University Coordinator'), getPendingProviders);
router.put('/providers/:id/approve', authorizeRoles('Admin', 'University Coordinator'), approveProvider);

router.put('/users/:id', authorizeRoles('Admin'), updateUser);
router.delete('/users/:id', authorizeRoles('Admin'), deleteUser);

module.exports = router;
