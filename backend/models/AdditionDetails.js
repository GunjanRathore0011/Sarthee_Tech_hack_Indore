const mongoose = require('mongoose');
const {User } = require('./User'); // Adjust the path as necessary

const AdditionDetails = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',       // reference to User schema
    required: true,
  },
  complainIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',  // reference to Complaint schema
      // required: true,
    }
  ],
  fullName: {
    type: String,
    required: true,
  },
  documentId: {
    type: String,
    required: true, // e.g., Aadhar number, PAN number, etc.
  },
  dob: {
    type: Date,
    required: true,
  },

  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },

  house: {
    type: String,
    required: true,
  },

  street: {
    type: String,
    required: true,
  },

  colony: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    default: 'Madhya Pradesh',
    // required: true,
  },

  district: {
    type: String,
    required: true,
  },

  policeStation: {
    type: String,
    required: true,
  },

  pincode: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('AdditionDetails', AdditionDetails);