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

    // Handle uploaded avatar file
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    const fieldsToUpdate = [
      'name',
      'title',
      'specialization',
      'bio',
      'address',
      'dob',
      'age',
      'gender',
      'phone',
      'businessType',
      'businessCategory',
      'businessName',
      'timezone',
      'preferredTiming',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Handle structured JSON/objects
    if (req.body.businessLocation) {
      try {
        user.businessLocation = typeof req.body.businessLocation === 'string'
          ? JSON.parse(req.body.businessLocation)
          : req.body.businessLocation;
      } catch (e) {
        console.error('Failed to parse businessLocation:', e);
      }
    }

    if (req.body.services) {
      try {
        user.services = typeof req.body.services === 'string'
          ? JSON.parse(req.body.services)
          : req.body.services;
      } catch (e) {
        console.error('Failed to parse services:', e);
      }
    }

    if (req.body.businessHours) {
      try {
        const parsedHours = typeof req.body.businessHours === 'string'
          ? JSON.parse(req.body.businessHours)
          : req.body.businessHours;

        user.businessHours = parsedHours;

        // If provider, also update live availability
        if (user.role === 'Provider' && Array.isArray(parsedHours)) {
          const dayMap = {
            sunday: 0,
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
          };

          const daysArray = [0, 1, 2, 3, 4, 5, 6].map((d) => ({
            dayOfWeek: d,
            slots: [],
            isActive: false,
          }));

          parsedHours.forEach((bh) => {
            const dIndex = typeof bh.dayOfWeek === 'number' ? bh.dayOfWeek : dayMap[String(bh.day).toLowerCase()];
            if (dIndex !== undefined && daysArray[dIndex]) {
              daysArray[dIndex].isActive = !!bh.isOpen;
              if (bh.isOpen && bh.startTime && bh.endTime) {
                daysArray[dIndex].slots = [{ start: bh.startTime, end: bh.endTime }];
              }
            }
          });

          await Availability.findOneAndUpdate(
            { provider: user._id },
            {
              weeklyHours: daysArray,
              timezone: user.timezone || 'Asia/Kolkata',
              slotDuration: user.services?.[0]?.duration || 30,
            },
            { upsert: true, new: true }
          );
        }
      } catch (e) {
        console.error('Failed to parse businessHours:', e);
      }
    }

    if (req.body.bookingInterests) {
      try {
        user.bookingInterests = typeof req.body.bookingInterests === 'string'
          ? JSON.parse(req.body.bookingInterests)
          : req.body.bookingInterests;
      } catch (e) {
        console.error('Failed to parse bookingInterests:', e);
      }
    }

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
