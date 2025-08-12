const axios = require("axios");
const ScanLog = require("../models/ScanLog");

exports.scanText = async (req, res) => {
  const { text } = req.body;
  console.log("Received text for scanning:", text);

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);

    let result = {
      status: "Safe",
      reason: "✅ No threats or suspicious patterns detected."
    };

    // ✅ Google Safe Browsing API Check
    if (urls && urls.length > 0) {
      const response = await axios.post(
        `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_SAFE_KEY}`,
        {
          client: { clientId: "cyber-app", clientVersion: "1.0" },
          threatInfo: {
         threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: urls.map((u) => ({ url: u })),
          },
        }
      );

      if (response.data && response.data.matches) {
        result = {
          status: "High Risk",
          reason: "⚠️ URL found in phishing/malware database."
        };
      }
    }

    // ✅ Save Result to MongoDB
    await ScanLog.create({
      text,
      status: result.status,
      reason: result.reason
    });

    return res.json(result);
  } catch (error) {
    console.error("🔥 scanText Error Details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    return res.status(500).json({
      error: error.response?.data || error.message || "Unknown error"
    });
  }
};
