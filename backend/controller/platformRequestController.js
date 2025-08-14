
const PlatformRequest = require("../models/PlatformRequest.js");
const crypto = require("crypto");

// Generate random reference ID
const generateRefId = () => {
  return (
    "REF-" +
    crypto.randomBytes(3).toString("hex").toUpperCase()
  );
};

// @desc Create a new platform request
exports.createRequest = async (req, res) => {
  try {
    const { platform, requestType, targetLink, reason, evidenceLink,entityValue } = req.body;

    const newRequest = await PlatformRequest.create({
      platform,
      requestType,
      targetLink,
      reason,
      evidenceLink,
      entityValue,
      referenceId: generateRefId(),
    });

    res.status(200).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await PlatformRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update request status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await PlatformRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
