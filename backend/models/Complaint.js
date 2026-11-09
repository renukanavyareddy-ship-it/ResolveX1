const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Rejected', 'Reopened']
    },
    comment: {
      type: String,
      default: ''
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedByName: {
      type: String,
      default: 'System'
    },
    changedByRole: {
      type: String,
      default: 'system'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const attachmentSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, default: '' },
    fileSize: { type: Number, default: 0 }
  },
  { _id: true }
);

const complaintSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Water Supply',
        'Electricity',
        'Roads and Transportation',
        'Sanitation and Cleanliness',
        'Street Lights',
        'Public Safety',
        'Education',
        'Healthcare',
        'Infrastructure',
        'Other'
      ],
      index: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
      index: true
    },
    location: {
      address: { type: String, required: [true, 'Address / location is required'], trim: true },
      city: { type: String, trim: true, default: '' },
      landmark: { type: String, trim: true, default: '' },
      pincode: { type: String, trim: true, default: '' }
    },
    attachments: [attachmentSchema],
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Rejected', 'Reopened'],
      default: 'Submitted',
      index: true
    },
    department: {
      type: String,
      default: null,
      index: true
    },
    assignedTo: {
      name: { type: String, default: '' },
      department: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      assignedAt: { type: Date }
    },
    adminResponse: {
      message: { type: String, default: '' },
      respondedBy: { type: String, default: '' },
      respondedAt: { type: Date }
    },
    statusHistory: [statusHistorySchema],
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        default: ''
      },
      submittedAt: {
        type: Date
      }
    },
    internalNotes: [
      {
        note: { type: String, required: true },
        addedBy: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Indexes for high performance searching
complaintSchema.index({ title: 'text', description: 'text' });
complaintSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);
