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
      type: Number,
      default: 30,
    },
    weeklyHours: [
      {
        dayOfWeek: {
          type: Number,
          required: true,
        },
        slots: [
          {
            start: {
              type: String,
              required: true,
            },
            end: {
              type: String,
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
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Availability', availabilitySchema);
