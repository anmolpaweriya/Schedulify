const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['Admin', 'Provider', 'Customer', 'Receptionist'],
      default: 'Customer',
    },
    avatar: {
      type: String,
      default: '',
    },
    // Provider specific fields
    title: {
      type: String, // e.g. Dr., Prof., Counselor, Attorney
      default: '',
    },
    specialization: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    // Onboarding and business details
    businessType: {
      type: String, // 'An Individual', 'Multi Staff Business', 'Multi Location Business'
      default: '',
    },
    businessCategory: {
      type: String,
      default: '',
    },
    businessName: {
      type: String,
      default: '',
    },
    businessLocation: {
      address: { type: String, default: '' },
      country: { type: String, default: 'India' },
      region: { type: String, default: '' },
      city: { type: String, default: '' },
      zip: { type: String, default: '' },
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
    services: [
      {
        title: { type: String, default: '' },
        duration: { type: Number, default: 30 },
        price: { type: Number, default: 0 },
      },
    ],
    businessHours: [
      {
        day: { type: String },
        dayOfWeek: { type: Number },
        isOpen: { type: Boolean, default: true },
        startTime: { type: String, default: '09:00' },
        endTime: { type: String, default: '17:00' },
      },
    ],
    phone: {
      type: String,
      default: '',
    },
    bookingInterests: [
      {
        type: String,
      },
    ],
    preferredTiming: {
      type: String,
      default: '',
    },
    dob: {
      type: String,
      default: '',
    },
    age: {
      type: Number,
      default: null,
    },
    gender: {
      type: String,
      enum: ['', 'Male', 'Female', 'Other'],
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: function () {
        return this.role === 'Provider' ? 'Pending' : 'Approved';
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
