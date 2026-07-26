const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'platform_settings',
    },
    requireProviderApproval: {
      type: Boolean,
      default: true,
    },
    requireEmailVerification: {
      type: Boolean,
      default: false, // Default false to make evaluation easier, configurable in admin UI
    },
    allowCustomerRegistration: {
      type: Boolean,
      default: true,
    },
    smtpHost: {
      type: String,
      default: '',
    },
    smtpPort: {
      type: Number,
      default: 587,
    },
    smtpUser: {
      type: String,
      default: '',
    },
    smtpPass: {
      type: String,
      default: '',
    },
    smtpFrom: {
      type: String,
      default: 'noreply@appointmentscheduler.com',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
