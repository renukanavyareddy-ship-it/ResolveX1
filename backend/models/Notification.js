const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      index: true
    },
    trackingId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Complaint Update'
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['status_change', 'admin_response', 'assignment', 'feedback_request', 'system'],
      default: 'status_change'
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
