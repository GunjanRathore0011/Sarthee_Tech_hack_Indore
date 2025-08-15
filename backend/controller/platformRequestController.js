const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    const refId = generateRefId();
    // 1️⃣ Create the LLM prompt
    const prompt = `
    Given this case:
    Reason: ${reason}
    Platform: ${platform}
    Request Type: ${requestType}
    Target Link: ${targetLink}
    Entity Value: ${entityValue}
    Evidence Link: ${evidenceLink}
    Reference ID: ${refId}

    Suggest applicable Indian legal sections (IT Act, CrPC, etc.).
    Generate a formal legal notice email to the platform’s grievance officer.
    Format email as:
    - To:
    - Subject:
    - Body:
    `;

    // 2️⃣ Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const llmResult = await model.generateContent(prompt);
    const llmText = llmResult.response.text();

    // 3️⃣ Save request in DB (including draft email)
    const newRequest = await PlatformRequest.create({
      platform,
      requestType,
      targetLink,
      reason,
      evidenceLink,
      entityValue,
      referenceId: refId,
      emailDraft: llmText // store generated email
    });

    // 4️⃣ Send response to frontend (so admin can see draft)
    res.status(200).json({
      success: true,
      data: newRequest,
      emailDraft: llmText
    });
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
