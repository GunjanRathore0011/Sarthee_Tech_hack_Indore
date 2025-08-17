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
},
{
  timestamps: true, // adds createdAt and updatedAt
  strict: false     // allows dynamic fields from frontend
});

const TrackingVisit = mongoose.model('TrackingVisit', trackingVisitSchema);
module.exports = TrackingVisit;
