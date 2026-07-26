const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Availability = require('../models/Availability');
const Settings = require('../models/Settings');
const { sendEmail } = require('../utils/emailService');

// Get JWT Secret and expiration
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_123456';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

// Generate token and set cookie
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      status: user.status,
      title: user.title,
      department: user.department,
      specialization: user.specialization,
      bio: user.bio,
    },
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, title, department, specialization, bio } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Determine verification settings
    const settings = await Settings.findOne({ key: 'platform_settings' });
    const requireEmailVerification = settings?.requireEmailVerification || false;

    // Create verification token if required
    let emailVerificationToken = undefined;
    let emailVerificationExpire = undefined;
    if (requireEmailVerification) {
      emailVerificationToken = crypto.randomBytes(20).toString('hex');
      emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Customer',
      title: role === 'Provider' ? title : '',
      department: role === 'Provider' ? (department || null) : null,
      specialization: role === 'Provider' ? specialization : '',
      bio: role === 'Provider' ? bio : '',
      isEmailVerified: !requireEmailVerification,
      emailVerificationToken,
      emailVerificationExpire,
    });

    // If Provider, initialize empty Availability
    if (user.role === 'Provider') {
      const defaultWeeklyHours = [];
      // Sunday=0, Monday=1, ..., Saturday=6
      for (let i = 1; i <= 5; i++) {
        defaultWeeklyHours.push({
          dayOfWeek: i,
          slots: [
            { start: '09:00', end: '12:00' },
            { start: '13:00', end: '17:00' },
          ],
          isActive: true,
        });
      }
      await Availability.create({
        provider: user._id,
        timezone: 'Asia/Kolkata',
        slotDuration: 30,
        weeklyHours: defaultWeeklyHours,
      });
    }

    // Send verification email if required
    if (requireEmailVerification && emailVerificationToken) {
      const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verifyemail?token=${emailVerificationToken}`;
      const message = `Please verify your email address by clicking on the link: \n\n ${verificationUrl}`;

      await sendEmail({
        to: user.email,
        subject: 'Email Verification Request',
        text: message,
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
      });
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check email verification status
    if (!user.isEmailVerified) {
      return res.status(401).json({ success: false, message: 'Please verify your email to log in' });
    }

    // Check provider approval status
    if (user.role === 'Provider' && user.status === 'Pending') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval. You will receive an email once approved.',
      });
    } else if (user.role === 'Provider' && user.status === 'Rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your provider application has been rejected by the administrator.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Public
exports.logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('department');
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify email address
// @route   GET /api/auth/verifyemail
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Verification token is required' });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with that email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set hashed token and expire time
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    const emailSent = await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: message,
    });

    if (emailSent.success) {
      res.status(200).json({ success: true, message: 'Password reset link sent to your email' });
    } else {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    // Hash token from param
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful! You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
