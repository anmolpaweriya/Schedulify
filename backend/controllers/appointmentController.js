const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Department = require('../models/Department');
const { sendEmail } = require('../utils/emailService');

// Helper to create In-App notifications
const createNotification = async (recipientId, title, message, type = 'Appointment') => {
  try {
    await Notification.create({
      recipient: recipientId,
      title,
      message,
      type,
    });
  } catch (error) {
    console.error('Error creating in-app notification:', error);
  }
};

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private/Customer
exports.bookAppointment = async (req, res) => {
  try {
    const { providerId, departmentId, date, startTime, endTime, reason } = req.body;

    // Validate provider
    const provider = await User.findById(providerId);
    if (!provider || provider.role !== 'Provider' || provider.status !== 'Approved') {
      return res.status(400).json({ success: false, message: 'Invalid provider selected' });
    }

    // Validate department
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(400).json({ success: false, message: 'Invalid department selected' });
    }

    // Check if slot is already booked for this provider on this date and time
    const existing = await Appointment.findOne({
      provider: providerId,
      date,
      'timeSlot.start': startTime,
      status: { $in: ['Pending', 'Approved', 'Rescheduled'] },
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      customer: req.user.id,
      provider: providerId,
      department: departmentId,
      date,
      timeSlot: {
        start: startTime,
        end: endTime,
      },
      reason,
    });

    // Notify Provider (In-app and Email)
    const providerMsg = `New appointment booked by ${req.user.name} on ${date} at ${startTime}`;
    await createNotification(providerId, 'New Appointment Booking', providerMsg);

    await sendEmail({
      to: provider.email,
      subject: 'New Appointment Booking Request',
      text: `${providerMsg}.\nReason: ${reason}\n\nPlease log in to approve or reject the request.`,
    });

    // Notify Customer
    const customerMsg = `Your appointment booking request with ${provider.title || ''} ${provider.name} on ${date} at ${startTime} has been submitted.`;
    await createNotification(req.user.id, 'Appointment Submitted', customerMsg);

    await sendEmail({
      to: req.user.email,
      subject: 'Appointment Booking Request Received',
      text: `${customerMsg}\n\nYou will be notified once the provider updates the status.`,
    });

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    const { status, date, providerId, departmentId } = req.query;
    let query = {};

    // Filter by role
    if (req.user.role === 'Customer') {
      query.customer = req.user.id;
    } else if (req.user.role === 'Provider') {
      query.provider = req.user.id;
    }
    // Admin, Receptionist, University Coordinator can see all

    if (status) {
      query.status = status;
    }
    if (date) {
      query.date = date;
    }
    if (providerId) {
      query.provider = providerId;
    }
    if (departmentId) {
      query.department = departmentId;
    }

    const appointments = await Appointment.find(query)
      .populate('customer', 'name email avatar')
      .populate('provider', 'name email avatar title department specialization')
      .populate('department', 'name category code')
      .sort({ date: 1, 'timeSlot.start': 1 });

    res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single appointment details
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer', 'name email avatar')
      .populate('provider', 'name email avatar title department specialization')
      .populate('department', 'name category code');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Access control
    if (
      req.user.role === 'Customer' && appointment.customer._id.toString() !== req.user.id &&
      req.user.role === 'Provider' && appointment.provider._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this appointment' });
    }

    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept/Approve appointment
// @route   PUT /api/appointments/:id/accept
// @access  Private/Provider/Receptionist
exports.acceptAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer')
      .populate('provider');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Access control
    if (req.user.role === 'Provider' && appointment.provider._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to approve this appointment' });
    }

    appointment.status = 'Approved';
    await appointment.save();

    // Send notifications
    const msg = `Your appointment with ${appointment.provider.title || ''} ${appointment.provider.name} on ${appointment.date} at ${appointment.timeSlot.start} has been approved.`;
    await createNotification(appointment.customer._id, 'Appointment Approved', msg);

    await sendEmail({
      to: appointment.customer.email,
      subject: 'Appointment Confirmed',
      text: msg,
    });

    res.status(200).json({ success: true, message: 'Appointment approved successfully', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject appointment
// @route   PUT /api/appointments/:id/reject
// @access  Private/Provider/Receptionist
exports.rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer')
      .populate('provider');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Access control
    if (req.user.role === 'Provider' && appointment.provider._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to reject this appointment' });
    }

    appointment.status = 'Rejected';
    await appointment.save();

    // Send notifications
    const msg = `Your appointment request with ${appointment.provider.title || ''} ${appointment.provider.name} on ${appointment.date} at ${appointment.timeSlot.start} has been declined.`;
    await createNotification(appointment.customer._id, 'Appointment Declined', msg);

    await sendEmail({
      to: appointment.customer.email,
      subject: 'Appointment Declined',
      text: msg,
    });

    res.status(200).json({ success: true, message: 'Appointment rejected successfully', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer')
      .populate('provider');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Check if requester is customer, provider, or administrator
    const isCustomer = appointment.customer._id.toString() === req.user.id;
    const isProvider = appointment.provider._id.toString() === req.user.id;
    const isAdmin = ['Admin', 'Receptionist', 'University Coordinator'].includes(req.user.role);

    if (!isCustomer && !isProvider && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    // Determine recipient and message
    const cancelledBy = req.user.name;
    const msg = `Appointment scheduled for ${appointment.date} at ${appointment.timeSlot.start} has been cancelled by ${cancelledBy}.`;

    // Notify BOTH customer and provider
    await createNotification(appointment.customer._id, 'Appointment Cancelled', msg);
    await createNotification(appointment.provider._id, 'Appointment Cancelled', msg);

    await sendEmail({
      to: appointment.customer.email,
      subject: 'Appointment Cancelled',
      text: msg,
    });

    await sendEmail({
      to: appointment.provider.email,
      subject: 'Appointment Cancelled',
      text: msg,
    });

    res.status(200).json({ success: true, message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete appointment
// @route   PUT /api/appointments/:id/complete
// @access  Private/Provider
exports.completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer')
      .populate('provider');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.provider._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    appointment.status = 'Completed';
    await appointment.save();

    const msg = `Your appointment with ${appointment.provider.title || ''} ${appointment.provider.name} on ${appointment.date} has been marked as Completed.`;
    await createNotification(appointment.customer._id, 'Appointment Completed', msg);

    res.status(200).json({ success: true, message: 'Appointment marked as completed', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private
exports.rescheduleAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customer')
      .populate('provider');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Access control
    const isCustomer = appointment.customer._id.toString() === req.user.id;
    const isProvider = appointment.provider._id.toString() === req.user.id;
    const isAuth = ['Admin', 'Receptionist', 'University Coordinator'].includes(req.user.role);

    if (!isCustomer && !isProvider && !isAuth) {
      return res.status(403).json({ success: false, message: 'Not authorized to reschedule this appointment' });
    }

    const { newDate, startTime, endTime, reason } = req.body;

    // Check if slot is already booked for provider
    const existing = await Appointment.findOne({
      _id: { $ne: appointment._id },
      provider: appointment.provider._id,
      date: newDate,
      'timeSlot.start': startTime,
      status: { $in: ['Pending', 'Approved', 'Rescheduled'] },
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'This slot is already booked' });
    }

    // Save history
    appointment.rescheduleHistory.push({
      previousDate: appointment.date,
      previousTimeSlot: {
        start: appointment.timeSlot.start,
        end: appointment.timeSlot.end,
      },
      rescheduledBy: req.user.id,
      reason: reason || 'Not specified',
    });

    appointment.date = newDate;
    appointment.timeSlot = { start: startTime, end: endTime };
    appointment.status = 'Rescheduled';

    await appointment.save();

    // Notify BOTH sides
    const msg = `Appointment has been rescheduled to ${newDate} at ${startTime} by ${req.user.name}.`;
    await createNotification(appointment.customer._id, 'Appointment Rescheduled', msg);
    await createNotification(appointment.provider._id, 'Appointment Rescheduled', msg);

    await sendEmail({
      to: appointment.customer.email,
      subject: 'Appointment Rescheduled',
      text: msg,
    });

    await sendEmail({
      to: appointment.provider.email,
      subject: 'Appointment Rescheduled',
      text: msg,
    });

    res.status(200).json({ success: true, message: 'Appointment rescheduled successfully', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update meeting notes for appointment
// @route   PUT /api/appointments/:id/notes
// @access  Private/Provider
exports.updateMeetingNotes = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.provider.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to add notes to this appointment' });
    }

    appointment.meetingNotes = req.body.notes;
    await appointment.save();

    res.status(200).json({ success: true, message: 'Meeting notes updated successfully', appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
