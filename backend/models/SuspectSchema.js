const mongoose = require('mongoose');

const SuspectSchema = new mongoose.Schema({
  
    complainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint', // reference to Complaint schema
    // required: true, 
    },
  suspectedName: {
    type: String,
    trim: true
  },
  suspectedCard: {
    type: String,
    trim: true
  },
  suspectedCardNumber: {
    type: String,
    trim: true
  },  
  suspectedImages: [{
    type: String,
  }],
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Suspect', SuspectSchema);
