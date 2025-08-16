const mongoose = require('mongoose');

const trackingVisitSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true
  },
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrackingLink',
    required: true
  },
  ipAddress: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const TrackingVisit = mongoose.model('TrackingVisit', trackingVisitSchema);
module.exports = TrackingVisit;
