const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/complaintController');

// Public route for duplicate detection preview
router.post('/check-duplicate', checkDuplicateComplaints);

// Public route for tracking complaint with Tracking ID
router.get('/track/:trackingId', trackComplaint);

// Admin export to CSV
router.get('/export/csv', protect, adminOnly, exportComplaintsCSV);

// User complaints
router.get('/my', protect, getMyComplaints);

// Complaint creation (with multi-file uploads)
router.post('/', protect, upload.array('attachments', 5), createComplaint);

// Admin get all complaints
router.get('/', protect, adminOnly, getComplaints);

// Specific complaint operations
router.get('/:id', protect, getComplaintById);
router.put('/:id/status', protect, adminOnly, updateComplaintStatus);
router.put('/:id/assign', protect, adminOnly, assignComplaint);
router.put('/:id/priority', protect, adminOnly, updatePriority);
router.post('/:id/response', protect, adminOnly, addAdminResponse);
router.post('/:id/internal-note', protect, adminOnly, addInternalNote);
router.put('/:id/reopen', protect, reopenComplaint);
router.post('/:id/feedback', protect, submitFeedback);

module.exports = router;
