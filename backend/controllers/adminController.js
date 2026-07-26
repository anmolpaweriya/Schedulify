const User = require('../models/User');
const Settings = require('../models/Settings');
const { sendEmail } = require('../utils/emailService');

// @desc    Get platform settings
// @route   GET /api/admin/settings
// @access  Private/Admin
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: 'platform_settings' });
    if (!settings) {
      settings = await Settings.create({ key: 'platform_settings' });
    }
    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update platform settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: 'platform_settings' });
    if (!settings) {
      settings = new Settings({ key: 'platform_settings' });
    }

    const fields = [
      'requireProviderApproval',
      'requireEmailVerification',
      'allowCustomerRegistration',
      'smtpHost',
      'smtpPort',
      'smtpUser',
      'smtpPass',
      'smtpFrom',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    await settings.save();
    res.status(200).json({ success: true, message: 'Settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pending provider requests
// @route   GET /api/admin/providers/pending
// @access  Private/Admin/Coordinator
exports.getPendingProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: 'Provider', status: 'Pending' }).populate('department');
    res.status(200).json({ success: true, count: providers.length, providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve/Reject provider application
// @route   PUT /api/admin/providers/:id/approve
// @access  Private/Admin/Coordinator
exports.approveProvider = async (req, res) => {
  try {
    const { status } = req.body; // Approved or Rejected
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const provider = await User.findById(req.params.id);
    if (!provider || provider.role !== 'Provider') {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    provider.status = status;
    await provider.save();

    // Notify provider by email
    const subject = status === 'Approved' ? 'Provider Account Approved!' : 'Provider Account Application Status';
    const text = status === 'Approved'
      ? `Congratulations! Your provider account on Appointment Scheduler has been approved. You can now log in and set up your availability.`
      : `We regret to inform you that your provider application has been declined. Please contact administration for more details.`;

    await sendEmail({
      to: provider.email,
      subject,
      text,
    });

    res.status(200).json({ success: true, message: `Provider application ${status.toLowerCase()}`, provider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user details (Admin only)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, role, status, department } = req.body;

    if (name) user.name = name;
    if (role) user.role = role;
    if (status) user.status = status;
    if (department !== undefined) user.department = department || null;

    await user.save();
    res.status(200).json({ success: true, message: 'User details updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
