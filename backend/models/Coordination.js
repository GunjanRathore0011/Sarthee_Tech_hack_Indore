const mongoose = require("mongoose");

const platformRequestSchema = new mongoose.Schema(
  {
    complainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true
    },

    // A single object to store all platform request details
    requests: {
      platform: {
        type: String,
        // required: true,
      },
      requestType: {
        type: String,
      },
      targetLink: {
        type: String,
      },
      reason: {
        type: String,
      },
      referenceId: {
        type: String,
      },
      ackAt: Date,
      doneAt: Date,
      status: {
        type: String,
        enum: ["Pending", "Acknowledged", "Completed"],
        default: "Pending"
      },
      emailDraft: {
        type: [String],
        default: [] // Changed from "" to []
      },
       subject: {
        type: String,
        default: "",
      },
      body: {
        type: String,
        default: "",
      },
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("coordination", platformRequestSchema);