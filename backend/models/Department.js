const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a department name'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Please add a code (e.g., CS, CARDIO, HR)'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Education', 'Healthcare', 'Corporate', 'Government', 'Legal', 'Consulting', 'Other'],
      default: 'Other',
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Department', departmentSchema);
