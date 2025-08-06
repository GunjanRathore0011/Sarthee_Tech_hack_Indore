const mongoose = require('mongoose');

const investigatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  badgeId: {
    type: String,
    unique: true,
    required: true
  },
//   rank: {
//     type: String,
//     enum: ['Junior Investigator', 'Senior Investigator', 'Cyber Expert', 'Admin'],
//     default: 'Junior Investigator'
//   },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },

  //  More detailed assignedCases tracking
  assignedCases: [{
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },  
    remarks: {
      type: String,
      default: ''
    },    
  }],

  solvedCases: [{
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
    },
    solvedAt: {
      type: Date,
        default: Date.now
    },
}],
  station: {
    type: String,
    required: true
  },

  specialistIn: {
  type: [String],
  enum: [
    'Phishing',
    'Financial Fraud',
    'Social Engineering',
    'Dark Web',
    'Malware Analysis',
    'Sextortion',
    'Cyber Terrorism',
    'Forensics',
    'Data Breach',
    'Online Harassment',
    'Child Exploitation',
    'Crypto Scam',
    'AI Deepfake',
    'Ransomware'
  ],
  default: []
},

  createdAt: {
    type: Date,
    default: Date.now
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
});


const Investigator = mongoose.model('Investigator', investigatorSchema);
module.exports = Investigator;
  

