const Suspect = require('../models/SuspectSchema');
const PatternAlert = require('../models/PatternAlert');
const { checkAndCreateAlerts } = require('../utils/pattern');
require('dotenv').config();

// Utility: maskCardNumber (keep last 4)
function maskCardNumber(cardNumber) {
  if (!cardNumber) return null;
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length <= 4) return digits;
  return 'XXXX-'.repeat(Math.max(0, Math.ceil((digits.length-4)/4))) + digits.slice(-4);
}

// Utility: generate SHA256 hash from buffer or string
function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

exports.SuspectController = async (req,res) => {
     try {
    // if you're using multer, images can be in req.files; here we'll accept base64 strings in suspectedImages
    const { complainId, suspectedName, suspectedCard, suspectedCardNumber, suspectedImages } = req.body;

    const suspect = new Suspect({ complainId, suspectedName, suspectedCard, suspectedCardNumber, suspectedImages: [] });

    // If images provided as base64 strings, compute hash & store only reference (optionally store URL if you upload files elsewhere)
    const imageHashes = [];
    if (Array.isArray(suspectedImages)) {
      for (const b64 of suspectedImages) {
        try {
          // Accept base64 without header
          const buffer = Buffer.from(b64, 'base64');
          const hash = sha256Hex(buffer);
          // we'll store the hash in suspectedImages array for later comparison
          suspect.suspectedImages.push(hash);
          imageHashes.push(hash);
        } catch (err) {
          // ignore invalid images
        }
      }
    }

    if (suspectedCardNumber) {
      // optional: store masked number in suspect doc or only store in pattern detection index
      suspect.suspectedCardNumber = maskCardNumber(suspectedCardNumber);
    }

    await suspect.save();

    // Trigger passive pattern check (async, don't block response)
    checkAndCreateAlerts(suspect).catch(err => console.error('Pattern check error', err));

    res.status(201).json({ success: true, suspect });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

exports.PatternAlertController = async (req, res) => {
    try {
    const alerts = await PatternAlert.find().sort({ lastDetectedAt: -1 }).limit(100).lean();
    res.json({ success: true, alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}   