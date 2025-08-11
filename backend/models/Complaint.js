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
    default: 0 // amount of money lost in the incident
  },

  delay_in_report: {
    type: Boolean,
    required: true // e.g., number of days delay
  },
  reason_of_delay: {
    type: String,
    // required: true // number of days delay in reporting the incident    
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
  enum: ['Pending', 'AssignInvestigator', 'In_review', 'Resolved', 'Rejected'],
  default: 'Pending'
},

statusHistory: [
  {
    status: {
      type: String,
      enum: ['Pending', 'AssignInvestigator', 'In_review', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    remark: {
      type: String,
      default: ''
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    
  }
],

  assignedTo: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investigator', // reference to the User who is assigned to handle the complaint
    default: null // initially no user is assigned
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium' // priority level of the complaint
  },
  screenShots: {
    type: [String], // Array of image/file URLs
    default: [] // default to an empty array if no screenshots are provided
    },
    complain_report:{
      type : String,
      default:''
    }

  
}, {
  timestamps: true, // adds createdAt and updatedAt
  strict: false     // allows dynamic fields from frontend
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;