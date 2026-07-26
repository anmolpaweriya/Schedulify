const express = require('express');
const {
  getDepartments,
  getAllDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', getDepartments);
router.get('/all', protect, authorizeRoles('Admin', 'University Coordinator'), getAllDepartments);
router.get('/:id', getDepartment);

router.post('/', protect, authorizeRoles('Admin', 'University Coordinator'), createDepartment);
router.put('/:id', protect, authorizeRoles('Admin', 'University Coordinator'), updateDepartment);
router.delete('/:id', protect, authorizeRoles('Admin'), deleteDepartment);

module.exports = router;
