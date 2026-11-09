const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const generateTrackingId = require('../utils/generateTrackingId');
const { sendComplaintRegisteredEmail, sendStatusUpdateEmail } = require('../utils/emailService');
const { findPotentialDuplicates } = require('../utils/duplicateDetector');

// Helper to get socket.io instance
const getIO = (req) => req.app.get('io');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (User)
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority, address, city, landmark, pincode } = req.body;

    if (!title || !description || !category || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, category, and address'
      });
    }

    // Process uploaded files if any
    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        attachments.push({
          fileName: file.originalname,
          filePath: `/uploads/${file.filename}`,
          fileType: file.mimetype,
          fileSize: file.size
        });
      });
    }

    // Generate unique tracking ID
    let trackingId = generateTrackingId();
    // Ensure uniqueness
    let exists = await Complaint.findOne({ trackingId });
    while (exists) {
      trackingId = generateTrackingId();
      exists = await Complaint.findOne({ trackingId });
    }

    // Initial status history
    const statusHistory = [
      {
        status: 'Submitted',
        comment: 'Complaint submitted by citizen and queued for department review.',
        changedBy: req.user._id,
        changedByName: req.user.name,
        changedByRole: req.user.role,
        timestamp: new Date()
      }
    ];

    const complaint = await Complaint.create({
      trackingId,
      userId: req.user._id,
      title: title.trim(),
      description: description.trim(),
      category,
      priority: priority || 'Medium',
      location: {
        address: address.trim(),
        city: (city || '').trim(),
        landmark: (landmark || '').trim(),
        pincode: (pincode || '').trim()
      },
      attachments,
      status: 'Submitted',
      statusHistory
    });

    // Create a confirmation notification for the user
    await Notification.create({
      userId: req.user._id,
      complaintId: complaint._id,
      trackingId: complaint.trackingId,
      title: 'Complaint Registered',
      message: `Your complaint "${complaint.title}" has been registered with Tracking ID: ${complaint.trackingId}`,
      type: 'status_change'
    });

    // Send confirmation email
    sendComplaintRegisteredEmail(req.user, complaint).catch(err =>
      console.error('Email error:', err.message)
    );

    // Real-time broadcast via Socket.IO
    const io = getIO(req);
    if (io) {
      io.to('admins').emit('complaint:created', {
        complaint: {
          _id: complaint._id,
          trackingId: complaint.trackingId,
          title: complaint.title,
          category: complaint.category,
          priority: complaint.priority,
          status: complaint.status,
          userName: req.user.name,
          createdAt: complaint.createdAt
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints (Admin view with search, filter, pagination)
// @route   GET /api/complaints
// @access  Private (Admin)
const getComplaints = async (req, res, next) => {
  try {
    const {
      search,
      category,
      status,
      priority,
      department,
      startDate,
      endDate,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by priority
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Filter by department
    if (department && department !== 'All') {
      query.department = department;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Search query (trackingId, title, or description)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { trackingId: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
        { 'location.address': searchRegex },
        { 'location.city': searchRegex }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === 'asc' ? 1 : -1;

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('userId', 'name email phone avatar')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's complaints
// @route   GET /api/complaints/my
// @access  Private (User)
const getMyComplaints = async (req, res, next) => {
  try {
    const { status, category, search } = req.query;
    const query = { userId: req.user._id };

    if (status && status !== 'All') query.status = status;
    if (category && category !== 'All') query.category = category;

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { trackingId: searchRegex },
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email phone address avatar')
      .populate('statusHistory.changedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Role check: User can only see their own complaints
    if (req.user.role !== 'admin' && complaint.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this complaint' });
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track complaint by tracking ID (Public)
// @route   GET /api/complaints/track/:trackingId
// @access  Public
const trackComplaint = async (req, res, next) => {
  try {
    const trackingId = req.params.trackingId.trim().toUpperCase();
    const complaint = await Complaint.findOne({ trackingId })
      .select('-internalNotes')
      .populate('userId', 'name');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `No complaint found with Tracking ID: "${trackingId}"`
      });
    }

    // Safe public representation
    const publicData = {
      _id: complaint._id,
      trackingId: complaint.trackingId,
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      priority: complaint.priority,
      status: complaint.status,
      department: complaint.department,
      assignedTo: complaint.assignedTo ? { name: complaint.assignedTo.name, department: complaint.assignedTo.department } : null,
      location: {
        city: complaint.location?.city,
        landmark: complaint.location?.landmark
      },
      statusHistory: complaint.statusHistory.map(h => ({
        status: h.status,
        comment: h.comment,
        changedByName: h.changedByName,
        timestamp: h.timestamp
      })),
      adminResponse: complaint.adminResponse,
      feedback: complaint.feedback,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt
    };

    res.status(200).json({
      success: true,
      data: publicData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status (Admin)
// @route   PUT /api/complaints/:id/status
// @access  Private (Admin)
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, comment, adminResponse } = req.body;

    const complaint = await Complaint.findById(req.params.id).populate('userId', 'name email');
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const oldStatus = complaint.status;
    complaint.status = status;

    // Append to status history
    complaint.statusHistory.push({
      status,
      comment: comment || `Status updated from ${oldStatus} to ${status} by administration`,
      changedBy: req.user._id,
      changedByName: req.user.name,
      changedByRole: req.user.role,
      timestamp: new Date()
    });

    // Update admin response if provided
    if (adminResponse && adminResponse.trim()) {
      complaint.adminResponse = {
        message: adminResponse.trim(),
        respondedBy: req.user.name,
        respondedAt: new Date()
      };
    }

    await complaint.save();

    // Create notification for citizen
    await Notification.create({
      userId: complaint.userId._id,
      complaintId: complaint._id,
      trackingId: complaint.trackingId,
      title: `Complaint Status: ${status}`,
      message: `Your complaint (${complaint.trackingId}) has been updated to "${status}". ${adminResponse ? `Note: ${adminResponse}` : ''}`,
      type: 'status_change'
    });

    // Send email notification
    sendStatusUpdateEmail(complaint.userId, complaint, oldStatus, status, adminResponse).catch(err =>
      console.error('Email error:', err.message)
    );

    // Socket.IO event notification
    const io = getIO(req);
    if (io) {
      io.to(`user_${complaint.userId._id}`).emit('complaint:status_change', {
        complaintId: complaint._id,
        trackingId: complaint.trackingId,
        oldStatus,
        newStatus: status,
        message: comment || `Your complaint status changed to ${status}`
      });
      io.to('admins').emit('complaint:updated', {
        complaintId: complaint._id,
        trackingId: complaint.trackingId,
        status
      });
    }

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign complaint to department & staff (Admin)
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin)
const assignComplaint = async (req, res, next) => {
  try {
    const { department, staffName, staffEmail, staffPhone, note } = req.body;

    if (!department) {
      return res.status(400).json({ success: false, message: 'Department is required for assignment' });
    }

    const complaint = await Complaint.findById(req.params.id).populate('userId', 'name email');
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.department = department;
    complaint.assignedTo = {
      name: staffName || 'Department Officer',
      department,
      email: staffEmail || '',
      phone: staffPhone || '',
      assignedAt: new Date()
    };

    // If currently 'Submitted', elevate to 'Assigned'
    if (complaint.status === 'Submitted' || complaint.status === 'Under Review') {
      complaint.status = 'Assigned';
    }

    complaint.statusHistory.push({
      status: complaint.status,
      comment: `Assigned to ${department}${staffName ? ` (Staff: ${staffName})` : ''}. ${note || ''}`.trim(),
      changedBy: req.user._id,
      changedByName: req.user.name,
      changedByRole: req.user.role,
      timestamp: new Date()
    });

    await complaint.save();

    // Create notification
    await Notification.create({
      userId: complaint.userId._id,
      complaintId: complaint._id,
      trackingId: complaint.trackingId,
      title: 'Complaint Assigned',
      message: `Your complaint (${complaint.trackingId}) has been assigned to ${department} for action.`,
      type: 'assignment'
    });

    // Real-time broadcast
    const io = getIO(req);
    if (io) {
      io.to(`user_${complaint.userId._id}`).emit('complaint:status_change', {
        complaintId: complaint._id,
        trackingId: complaint.trackingId,
        newStatus: complaint.status,
        department
      });
      io.to('admins').emit('complaint:updated', {
        complaintId: complaint._id,
        department
      });
    }

    res.status(200).json({
      success: true,
      message: `Complaint assigned to ${department} successfully`,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint priority (Admin)
// @route   PUT /api/complaints/:id/priority
// @access  Private (Admin)
const updatePriority = async (req, res, next) => {
  try {
    const { priority } = req.body;
    if (!['Low', 'Medium', 'High', 'Critical'].includes(priority)) {
      return res.status(400).json({ success: false, message: 'Invalid priority value' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const oldPriority = complaint.priority;
    complaint.priority = priority;
    complaint.statusHistory.push({
      status: complaint.status,
      comment: `Priority adjusted from ${oldPriority} to ${priority}`,
      changedBy: req.user._id,
      changedByName: req.user.name,
      changedByRole: req.user.role,
      timestamp: new Date()
    });

    await complaint.save();

    res.status(200).json({
      success: true,
      message: `Priority changed to ${priority}`,
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add admin response / remarks
// @route   POST /api/complaints/:id/response
// @access  Private (Admin)
const addAdminResponse = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Response message cannot be empty' });
    }

    const complaint = await Complaint.findById(req.params.id).populate('userId', 'name email');
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.adminResponse = {
      message: message.trim(),
      respondedBy: req.user.name,
      respondedAt: new Date()
    };

    complaint.statusHistory.push({
      status: complaint.status,
      comment: `Admin Remark: ${message.trim()}`,
      changedBy: req.user._id,
      changedByName: req.user.name,
      changedByRole: req.user.role,
      timestamp: new Date()
    });

    await complaint.save();

    await Notification.create({
      userId: complaint.userId._id,
      complaintId: complaint._id,
      trackingId: complaint.trackingId,
      title: 'Administrator Response Added',
      message: `An administrator added a response to your complaint (${complaint.trackingId}): "${message.substring(0, 80)}..."`,
      type: 'admin_response'
    });

    const io = getIO(req);
    if (io) {
      io.to(`user_${complaint.userId._id}`).emit('complaint:status_change', {
        complaintId: complaint._id,
        trackingId: complaint.trackingId,
        message: 'Administrator response added'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Response posted successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add internal note (Admin only - invisible to citizen)
// @route   POST /api/complaints/:id/internal-note
// @access  Private (Admin)
const addInternalNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) {
      return res.status(400).json({ success: false, message: 'Internal note cannot be empty' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.internalNotes.push({
      note: note.trim(),
      addedBy: req.user.name,
      createdAt: new Date()
    });

    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'Internal note recorded',
      data: complaint.internalNotes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reopen a resolved or rejected complaint
// @route   PUT /api/complaints/:id/reopen
// @access  Private (User)
const reopenComplaint = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Must be the owner
    if (complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only reopen your own complaints' });
    }

    if (complaint.status !== 'Resolved' && complaint.status !== 'Rejected') {
      return res.status(400).json({
        success: false,
        message: 'Only Resolved or Rejected complaints can be reopened'
      });
    }

    const oldStatus = complaint.status;
    complaint.status = 'Reopened';
    complaint.statusHistory.push({
      status: 'Reopened',
      comment: `Reopened by citizen. Reason: ${reason || 'Issue persists / unsatisfied with resolution'}`.trim(),
      changedBy: req.user._id,
      changedByName: req.user.name,
      changedByRole: 'user',
      timestamp: new Date()
    });

    await complaint.save();

    // Real-time broadcast to admins
    const io = getIO(req);
    if (io) {
      io.to('admins').emit('complaint:updated', {
        complaintId: complaint._id,
        trackingId: complaint.trackingId,
        status: 'Reopened',
        reason
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint reopened successfully. An officer will re-evaluate.',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit feedback & rating on resolved complaint
// @route   POST /api/complaints/:id/feedback
// @access  Private (User)
const submitFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only rate your own complaints' });
    }

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for Resolved complaints'
      });
    }

    complaint.feedback = {
      rating: Number(rating),
      comment: (comment || '').trim(),
      submittedAt: new Date()
    };

    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'Thank you! Your feedback has been recorded.',
      data: complaint.feedback
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check potential duplicate complaints (Smart Feature)
// @route   POST /api/complaints/check-duplicate
// @access  Public or Private
const checkDuplicateComplaints = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;

    if (!title || title.trim().length < 4) {
      return res.status(200).json({ success: true, count: 0, duplicates: [] });
    }

    // Look for recent active complaints (last 60 days)
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const existing = await Complaint.find({
      createdAt: { $gte: sixtyDaysAgo },
      status: { $nin: ['Rejected'] }
    }).select('_id trackingId title description category status createdAt');

    const duplicates = findPotentialDuplicates({ title, description, category }, existing, 0.35);

    res.status(200).json({
      success: true,
      count: duplicates.length,
      duplicates
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export complaints as CSV (Admin)
// @route   GET /api/complaints/export/csv
// @access  Private (Admin)
const exportComplaintsCSV = async (req, res, next) => {
  try {
    const { category, status, priority, startDate, endDate } = req.query;

    const query = {};
    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const complaints = await Complaint.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    // Build CSV
    const headers = [
      'Tracking ID',
      'Title',
      'Category',
      'Priority',
      'Status',
      'Department',
      'Citizen Name',
      'Citizen Email',
      'Citizen Phone',
      'Address',
      'City',
      'Submitted Date',
      'Rating',
      'Feedback'
    ];

    const escapeCSV = (val) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = complaints.map(c => [
      escapeCSV(c.trackingId),
      escapeCSV(c.title),
      escapeCSV(c.category),
      escapeCSV(c.priority),
      escapeCSV(c.status),
      escapeCSV(c.department || 'Unassigned'),
      escapeCSV(c.userId?.name || 'Anonymous'),
      escapeCSV(c.userId?.email || 'N/A'),
      escapeCSV(c.userId?.phone || 'N/A'),
      escapeCSV(c.location?.address || 'N/A'),
      escapeCSV(c.location?.city || 'N/A'),
      escapeCSV(new Date(c.createdAt).toISOString().split('T')[0]),
      escapeCSV(c.feedback?.rating || 'Unrated'),
      escapeCSV(c.feedback?.comment || '')
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=ResolveX-Complaints-${Date.now()}.csv`);
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getMyComplaints,
  getComplaintById,
  trackComplaint,
  updateComplaintStatus,
  assignComplaint,
  updatePriority,
  addAdminResponse,
  addInternalNote,
  reopenComplaint,
  submitFeedback,
  checkDuplicateComplaints,
  exportComplaintsCSV
};
