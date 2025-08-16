const mongoose = require('mongoose');

const trackingLinkSchema = new mongoose.Schema({
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investigator',
    required: true
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  shortCode: { // jaise Grabify link ka unique code
    type: String,
    unique: true,
    required: true
  },
  clicks: [{
    ipAddress: String,
    userAgent: String,
    location: String,
    isp: String,
    clickedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const TrackingLink = mongoose.model('TrackingLink', trackingLinkSchema);
module.exports = TrackingLink;
