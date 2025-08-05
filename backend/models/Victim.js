const mongoose = require('mongoose');

const victimDetailsSchema = new mongoose.Schema({
    
    complainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint', // reference to Complaint schema
    // required: true,
    },

  bankName: {
    type: String,
    required: true,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true
  },
  ifscCode: {
    type: String,
    required: true,
    trim: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  transactionDate: {
    type: Date,
    required: true
  },
  screenshots: {
    type: [String],  // Array of image/file URLs
    default: []
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('VictimDetails', victimDetailsSchema);
