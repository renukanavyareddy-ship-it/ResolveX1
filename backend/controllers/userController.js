const User = require('../models/User');
const Complaint = require('../models/Complaint');

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role && role !== 'All') {
      query.role = role;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Attach complaint counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const totalComplaints = await Complaint.countDocuments({ userId: u._id });
        const resolvedComplaints = await Complaint.countDocuments({ userId: u._id, status: 'Resolved' });
        return {
          ...u,
          complaintsCount: totalComplaints,
          resolvedCount: resolvedComplaints
        };
      })
    );

    res.status(200).json({
      success: true,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: usersWithStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private (Admin)
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const complaints = await Complaint.find({ userId: user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        user,
        complaints
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin' && req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUser
};
