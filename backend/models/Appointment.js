const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String, // Format: "YYYY-MM-DD"
      required: true,
    },
    timeSlot: {
      start: {
        type: String, // Format: "10:30"
        required: true,
      },
      end: {
        type: String, // Format: "11:00"
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed', 'Rescheduled'],
      default: 'Pending',
    },
    reason: {
      type: String,
      required: [true, 'Please provide a reason for the appointment'],
      trim: true,
    },
    meetingNotes: {
      type: String,
      default: '',
    },
    meetingLink: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    rescheduleHistory: [
      {
        previousDate: String,
        previousTimeSlot: {
          start: String,
          end: String,
        },
        rescheduledBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        reason: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster lookups
appointmentSchema.index({ provider: 1, date: 1 });
appointmentSchema.index({ customer: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
