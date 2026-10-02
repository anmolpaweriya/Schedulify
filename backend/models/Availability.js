const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
    slotDuration: {
      type: Number, // In minutes, default is 30 mins
      default: 30,
    },
    weeklyHours: [
      {
        dayOfWeek: {
          type: Number, // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
          required: true,
        },
        slots: [
          {
            start: {
              type: String, // "09:00"
              required: true,
            },
            end: {
              type: String, // "12:00"
              required: true,
            },
          },
        ],
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    blockedDates: [
      {
        type: String, // "YYYY-MM-DD"
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Availability', availabilitySchema);
