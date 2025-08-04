const mongoose = require('mongoose');

// Complaint Schema Definition
const complaintSchema = new mongoose.Schema({
  // Required Fields
  // Reference to the User who filed the complaint
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  category: {
    type: String,
    required: true // e.g., 'Phishing', 'Scam'
  },
  subCategory: {
    type: String,
    required: true // e.g., 'Email Scam', 'Social Media Scam'
    },
  lost_money: {
    type: Number,
    required: true // true if money was lost
  },

  delay_in_report: {
    type: Boolean,
    required: true // e.g., number of days delay
  },
  reason_of_delay: {
    type: String,
    required: true // number of days delay in reporting the incident    
    },

     
  description: {
    type: String,
    maxlength: 1500,// max 1500 characters allowed
    required: true // detailed description of the incident},
  },
  incident_datetime: {
    type: Date,
    required :true// stores both date and time of incident
  },
  status: {
    type: String,
    enum: ['pending', 'in_review', 'resolved', 'rejected'],
    default: 'pending' // current complaint status
  },
  screenShots: {
    type: [String], // Array of image/file URLs
    default: [] // default to an empty array if no screenshots are provided
    },

  
}, {
  timestamps: true, // adds createdAt and updatedAt
  strict: false     // allows dynamic fields from frontend
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;