const mongoose = require('mongoose');

const PatternAlertSchema = new mongoose.Schema({
  type: { type: String, enum: ['name','cardNumber','imageHash'], required: true },
  key: { type: String, required: true }, 
  count: { type: Number, default: 0 },
  complaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }],
  firstDetectedAt: { type: Date },
  lastDetectedAt: { type: Date },
  riskScore: { type: String, enum: ['Low','Medium','High'], default: 'Medium' },
}, { timestamps: true });

module.exports = mongoose.model('PatternAlert', PatternAlertSchema);