const mongoose = require("mongoose");

const platformRequestSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: [
        "google_play",
        "amazon_appstore",
        "telegram",
        "facebook",
        "instagram",
        "x",
        "youtube",
        "github",
        "hosting_provider",
        "other"
      ]
    }
    ,
    requestType: {
      type: String,
      required: true,
      enum: [
        "TAKEDOWN",
        "DATA_REQUEST",
        "CONTENT_REMOVAL",
        "EMERGENCY_SHUTDOWN",
        "ACCOUNT_SUSPENSION"
      ]
    },

    targetLink: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    evidenceLink: String,
    referenceId: {
      type: String,
      required: true,
      unique: true
    },
    entityValue: String,
    entityType: String,
    
    ackAt: Date,
    doneAt: Date,
    status: {
      type: String,
      enum: ["Pending", "Acknowledged", "Completed"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlatformRequest", platformRequestSchema);
