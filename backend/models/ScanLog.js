const mongoose = require('mongoose');


const ScanLogSchema = new mongoose.Schema({
  text: String,
  status: String, // "High Risk" or "Safe"
  reason: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ScanLog", ScanLogSchema);
