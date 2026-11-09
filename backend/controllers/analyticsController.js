const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Get dashboard analytics & statistics
// @route   GET /api/analytics/dashboard
// @access  Private (Admin or Authenticated)
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const isUser = req.user.role !== 'admin';
    const filter = isUser ? { userId: req.user._id } : {};

    // 1. Overall Counts
    const totalComplaints = await Complaint.countDocuments(filter);
    const submittedCount = await Complaint.countDocuments({ ...filter, status: 'Submitted' });
    const underReviewCount = await Complaint.countDocuments({ ...filter, status: 'Under Review' });
    const assignedCount = await Complaint.countDocuments({ ...filter, status: 'Assigned' });
    const inProgressCount = await Complaint.countDocuments({ ...filter, status: 'In Progress' });
    const resolvedCount = await Complaint.countDocuments({ ...filter, status: 'Resolved' });
    const rejectedCount = await Complaint.countDocuments({ ...filter, status: 'Rejected' });
    const reopenedCount = await Complaint.countDocuments({ ...filter, status: 'Reopened' });
    const criticalCount = await Complaint.countDocuments({ ...filter, priority: 'Critical' });

    const pendingCount = submittedCount + underReviewCount;
    const activeInProgressCount = assignedCount + inProgressCount + reopenedCount;

    // Total Users (admin only)
    const totalUsers = isUser ? 1 : await User.countDocuments({ role: 'user' });

    // Resolution Rate %
    const resolutionRate = totalComplaints > 0
      ? Math.round((resolvedCount / totalComplaints) * 100)
      : 0;

    // 2. Category-wise Distribution
    const categoryAgg = await Complaint.aggregate([
      { $match: filter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const categoryDistribution = categoryAgg.map(item => ({
      name: item._id,
      count: item.count
    }));

    // 3. Status Distribution
    const statusDistribution = [
      { name: 'Submitted', count: submittedCount, color: '#f59e0b' },
      { name: 'Under Review', count: underReviewCount, color: '#6366f1' },
      { name: 'Assigned', count: assignedCount, color: '#06b6d4' },
      { name: 'In Progress', count: inProgressCount, color: '#3b82f6' },
      { name: 'Resolved', count: resolvedCount, color: '#10b981' },
      { name: 'Rejected', count: rejectedCount, color: '#ef4444' },
      { name: 'Reopened', count: reopenedCount, color: '#8b5cf6' }
    ].filter(s => s.count > 0 || !isUser);

    // 4. Priority Distribution
    const priorityAgg = await Complaint.aggregate([
      { $match: filter },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    const priorityDistribution = priorityAgg.map(p => ({
      priority: p._id,
      count: p.count
    }));

    // 5. Monthly Trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyTrendAgg = await Complaint.aggregate([
      { $match: { ...filter, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrend = monthlyTrendAgg.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      total: item.total,
      resolved: item.resolved
    }));

    // 6. Average Resolution Time (in days)
    const resolvedComplaints = await Complaint.find({ ...filter, status: 'Resolved' })
      .select('createdAt updatedAt')
      .lean();

    let avgResolutionDays = 0;
    if (resolvedComplaints.length > 0) {
      const totalTimeMs = resolvedComplaints.reduce((acc, c) => {
        return acc + (new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime());
      }, 0);
      avgResolutionDays = (totalTimeMs / (resolvedComplaints.length * 1000 * 60 * 60 * 24)).toFixed(1);
    }

    // 7. Recent Complaints
    const recentComplaints = await Complaint.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    // 8. Department Performance (Admin only)
    let departmentStats = [];
    if (!isUser) {
      departmentStats = await Complaint.aggregate([
        { $match: { department: { $ne: null } } },
        {
          $group: {
            _id: '$department',
            total: { $sum: 1 },
            resolved: {
              $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
            }
          }
        },
        { $sort: { total: -1 } }
      ]).then(docs => docs.map(d => ({
        department: d._id,
        total: d.total,
        resolved: d.resolved,
        resolutionRate: d.total > 0 ? Math.round((d.resolved / d.total) * 100) : 0
      })));
    }

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalComplaints,
          pendingComplaints: pendingCount,
          inProgressComplaints: activeInProgressCount,
          resolvedComplaints: resolvedCount,
          rejectedComplaints: rejectedCount,
          reopenedComplaints: reopenedCount,
          criticalComplaints: criticalCount,
          totalUsers,
          resolutionRate,
          avgResolutionDays: parseFloat(avgResolutionDays) || 0
        },
        categoryDistribution,
        statusDistribution,
        priorityDistribution,
        monthlyTrend,
        recentComplaints,
        departmentStats
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardAnalytics
};
