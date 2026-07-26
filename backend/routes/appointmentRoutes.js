const express = require('express');
const {
  bookAppointment,
  getAppointments,
  getAppointment,
  acceptAppointment,
  rejectAppointment,
  cancelAppointment,
  completeAppointment,
  rescheduleAppointment,
  updateMeetingNotes,
} = require('../controllers/appointmentController');
const { protect, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/', authorizeRoles('Customer'), bookAppointment);
router.get('/', getAppointments);
router.get('/:id', getAppointment);

router.put('/:id/accept', authorizeRoles('Provider', 'Receptionist'), acceptAppointment);
router.put('/:id/reject', authorizeRoles('Provider', 'Receptionist'), rejectAppointment);
router.put('/:id/cancel', cancelAppointment);
router.put('/:id/complete', authorizeRoles('Provider'), completeAppointment);
router.put('/:id/reschedule', rescheduleAppointment);
router.put('/:id/notes', authorizeRoles('Provider'), updateMeetingNotes);

module.exports = router;
