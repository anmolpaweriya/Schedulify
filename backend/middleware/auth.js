const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify token
const protect = async (req, res, next) => {
  let token;

  // Read token from Authorization header or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123456');

    // Find the user associated with token
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found with this token' });
    }

    // Check if provider is approved
    if (req.user.role === 'Provider' && req.user.status !== 'Approved') {
      return res.status(403).json({
        success: false,
        message: `Your provider account is currently ${req.user.status}. Please wait for admin approval.`,
      });
    }

    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

// Grant access to specific roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user ? req.user.role : 'Guest'} is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
