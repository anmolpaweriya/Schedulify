const User = require('../models/User');
const Availability = require('../models/Availability');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all active Providers
// @route   GET /api/users/providers
// @access  Public
exports.getProviders = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { role: 'Provider', status: 'Approved' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    const providers = await User.find(query);
    res.status(200).json({ success: true, count: providers.length, providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const fieldsToUpdate = [
      'name', 'title', 'specialization', 'bio', 'avatar',
      'address', 'dob', 'age', 'gender',
      'program', 'section', 'registrationNo', 'professionalId'
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    const updatedUser = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get provider availability slots
// @route   GET /api/users/providers/:id/availability
// @access  Public
exports.getProviderAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOne({ provider: req.params.id });
    if (!availability) {
      return res.status(404).json({ success: false, message: 'Availability schedule not found for this provider' });
    }
    res.status(200).json({ success: true, availability });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update provider availability slots (Provider only)
// @route   PUT /api/users/availability
// @access  Private/Provider
exports.updateAvailability = async (req, res) => {
  try {
    let availability = await Availability.findOne({ provider: req.user.id });

    if (!availability) {
      availability = new Availability({
        provider: req.user.id,
      });
    }

    const { timezone, slotDuration, weeklyHours, blockedDates } = req.body;

    if (timezone !== undefined) availability.timezone = timezone;
    if (slotDuration !== undefined) availability.slotDuration = slotDuration;
    if (weeklyHours !== undefined) availability.weeklyHours = weeklyHours;
    if (blockedDates !== undefined) availability.blockedDates = blockedDates;

    await availability.save();

    res.status(200).json({
      success: true,
      message: 'Availability settings updated successfully',
      availability,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
