const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Department = require('../models/Department');

// @desc    Get dashboard analytics summary
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardAnalytics = async (req, res) => {
  try {
    let matchQuery = {};

    // Scope by role if necessary
    if (req.user.role === 'Provider') {
      matchQuery.provider = req.user._id;
    } else if (req.user.role === 'Customer') {
      matchQuery.customer = req.user._id;
    }

    // 1. Core counters
    const totalAppointments = await Appointment.countDocuments(matchQuery);
    const pendingCount = await Appointment.countDocuments({ ...matchQuery, status: 'Pending' });
    const approvedCount = await Appointment.countDocuments({ ...matchQuery, status: 'Approved' });
    const completedCount = await Appointment.countDocuments({ ...matchQuery, status: 'Completed' });
    const cancelledCount = await Appointment.countDocuments({ ...matchQuery, status: 'Cancelled' });

    // 2. Appointments by status aggregation
    const statusData = [
      { name: 'Pending', value: pendingCount },
      { name: 'Approved', value: approvedCount },
      { name: 'Completed', value: completedCount },
      { name: 'Cancelled', value: cancelledCount },
    ];

    // 3. Department distribution (only for Admin/Coordinator/Receptionist)
    let deptDistribution = [];
    if (['Admin', 'University Coordinator', 'Receptionist'].includes(req.user.role)) {
      deptDistribution = await Appointment.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'departments',
            localField: '_id',
            foreignField: '_id',
            as: 'deptInfo',
          },
        },
        { $unwind: '$deptInfo' },
        {
          $project: {
            name: '$deptInfo.name',
            code: '$deptInfo.code',
            count: 1,
          },
        },
        { $sort: { count: -1 } },
      ]);
    }

    // 4. Appointments per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    // We group by date string
    const dailyBookings = await Appointment.aggregate([
      {
        $match: {
          ...matchQuery,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: '$date',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    // 5. System counters (Admin only)
    let systemCounts = {};
    if (req.user.role === 'Admin') {
      systemCounts = {
        users: await User.countDocuments(),
        providers: await User.countDocuments({ role: 'Provider' }),
        customers: await User.countDocuments({ role: 'Customer' }),
        departments: await Department.countDocuments(),
      };
    }

    res.status(200).json({
      success: true,
      summary: {
        total: totalAppointments,
        pending: pendingCount,
        approved: approvedCount,
        completed: completedCount,
        cancelled: cancelledCount,
      },
      statusData,
      deptDistribution,
      dailyBookings,
      systemCounts,
    });
  } catch (error) {
    console.error('Analytics aggregation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
