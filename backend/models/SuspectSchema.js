const mongoose = require('mongoose');

const SuspectSchema = new mongoose.Schema({
  
    complainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint', // reference to Complaint schema
    required: true, 
    },
  suspectedName: {
    type: String,
    required: true,
    trim: true
  },
  suspectedCard: {
    type: String,
    required: true,
    trim: true
  },
  suspectedCardNumber: {
    type: String,
    required: true,
    trim: true
  },  
  suspectedImages: [{
    type: String,
  }],
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Suspect', SuspectSchema);
