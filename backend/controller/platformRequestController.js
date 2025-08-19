const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const Complaint = require("../models/Complaint.js");
const mongoose = require("mongoose");
const coordination  = require("../models/Coordination.js");
const User = require("../models/User.js");
const VictimDetails = require("../models/Victim");
const SuspectSchema = require("../models/SuspectSchema");

// @desc Create a new platform request
exports.createRequest = async (req, res) => {
  try {
    const { complainId, platform, requestType, targetLink, reason } = req.body;

    // 1️⃣ Create the LLM prompt
    if (!complainId) {
      return res.status(400).json({ message: "Complaint ID is required" });
    }
    // const complainIdObj = mongoose.Types.ObjectId(complainId);
    //find complaint by ID
    const complaint = await Complaint.findById(complainId)
      .populate('userId assignedTo', 'name specialistIn');


    let victimDetails = null;
    try {
      victimDetails = await VictimDetails.findOne({ complainId: complainId });
    } catch (err) {
      victimDetails = null;
    }
    let suspectDetails = null;
    try {
      suspectDetails = await SuspectSchema.findOne({ complainId: complainId });
    } catch (err) {
      suspectDetails = null;
    }
    const cId = complaint.userId._id;
    // console.log(cId);
    // ✅ sahi
    const user = await User.findOne({ _id: cId });

    const payload = {
      _id: complaint._id,
      victimmName: user.userName,
      victimEmail: user.email,
      comPhone: user.number,
      category: complaint.category,
      subCategory: complaint.subCategory,
      description: complaint.description,
      incident_datetime: complaint?.incident_datetime || "N/A",
      lost_money: complaint.lost_money,
      victimDetails: victimDetails || null,
      suspectDetails: suspectDetails || null
    };

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found"
      });
    }

    console.log("Complaint details payload:", payload);
    const refId = `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;


    const prompt = `    
You are a compliance-savvy drafting assistant for cybercrime investigations.  
Your job is to convert complaint JSON payloads into professional formal emails to external platforms (banks, social media, app stores, hosting providers, etc.).  

### Rules:
- Output strictly as JSON with keys: {"subject": "...", "body": "..."}  
- Subject must follow the mapping below.  
- Body must follow the structured order below.  
- Do not invent facts. Use only the fields provided.  
- Omit sections if data is missing.  
- Keep the tone formal, concise, and legally appropriate.  

### Subject mapping (fallbacks allowed):
- Banking + (ACCOUNT_SUSPENSION|EMERGENCY_SHUTDOWN):  
  "Urgent Account Freeze Request – {beneficiary_account|account_number} – Ref {reference_id}"
- (telegram|facebook|instagram|x|youtube|github|google_play|amazon_appstore|hosting_provider|other) + TAKEDOWN:  
  "Urgent Takedown Request – {primary_target} – Ref {reference_id}"
- Any + CONTENT_REMOVAL:  
  "Content Removal Request – {primary_target} – Ref {reference_id}"
- Any + DATA_REQUEST:  
  "Lawful Data Request – {primary_target} – Ref {reference_id}"

### Body structure:
1. Address line: "Dear {platform_name or 'Compliance Team'},"  
2. Purpose: one-line reference with request_type, platform, and reference_id.  
3. Incident summary: category, subCategory, incident_datetime, description, loss_amount (if present).  
4. Targets: list all relevant identifiers clearly (account numbers, IFSC, transaction IDs, URLs, handles, phone numbers, package names, etc.).  
5. Requested Action (adapt per request_type):  
   - ACCOUNT_SUSPENSION/EMERGENCY_SHUTDOWN → freeze/hold account, block transactions, preserve balance.  
   - TAKEDOWN/CONTENT_REMOVAL → remove/disable target, prevent re-upload/cloning.  
   - DATA_REQUEST → provide subscriber info, metadata, login IPs, logs, payment info, linked identifiers; preserve evidence if requested.  
6. Legal/Authority: use "legal_basis" if provided, else say "under applicable law and your platform policies".  
7. Urgency/Deadline: mention if given.  
8. Attachments: mention if present.  
9. Closing: professional sign-off with officer/agency details.  
10. Confidentiality notice if present.  

### Input:
Complaint Details (JSON):
Complaint payload: ${JSON.stringify(payload, null, 2)}
Generate a platform request for ${platform} with the following details:
- Request Type: ${requestType}
- Target Link: ${targetLink}
- Reason: ${reason}
- Reference ID: ${refId}

### Output:
Respond with a JSON object containing:
- "subject": the email subject line
- "body": the full email body text
Make sure to follow the rules and structure above.
    `;

    // 2️⃣ Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const llmResult = await model.generateContent(prompt);
    const text = llmResult.response.text();
    console.log("LLM response text:", text);

    // Try to extract a JSON array from the model's output
    let structuredData = null;
    try {
      // Use a regex to specifically capture the content inside the code block
      // This pattern handles both object and array formats inside the block
      const jsonStringMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```|```json\s*(\[[\s\S]*?\])\s*```/);

      if (jsonStringMatch) {
        // The captured JSON will be in the first or second group of the regex match
        const jsonString = jsonStringMatch[1] || jsonStringMatch[2];

        // Attempt to parse the captured string
        const parsedData = JSON.parse(jsonString.trim());

        // Ensure the output is always an array for consistency
        structuredData = Array.isArray(parsedData) ? parsedData : [parsedData];
      } else {
        console.error("No valid JSON code block found in LLM response.");
      }
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr.message);
      structuredData = null; // Reset to null on failure
    }

    // Check if structuredData is a non-empty array
    let emailBody = "";
    if (structuredData.length > 0) {
      // Assuming the LLM returns an object with a 'body' key inside the array
      emailBody = structuredData[0].body || "";
      emailsubject = structuredData[0].subject || "Platform Request";
    }


    console.log("Structured Data:", refId);
    const newRequest = new coordination({
      complainId,
      requests: {
        platform,
        requestType,
        targetLink: targetLink || "",
        reason: reason || "",
        referenceId: refId,
        subject: emailsubject,
        body: emailBody,
      }
    });

    await newRequest.save();


    res.status(200).json({
      success: true,
      email: newRequest.requests.body,
      subject: newRequest.requests.subject,
      referenceId: newRequest.requests.referenceId,
      message: "Platform request created successfully",
      requestId: newRequest._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all requests
// @desc Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const { complainId } = req.body;

    if (!complainId) {
      return res.status(400).json({ message: "Complaint ID is required" });
    }
    // Find all requests for the given complainId
    // const complainIdObj = mongoose.Types.ObjectId(complainId);
    const requests = await coordination.find({ complainId: complainId }).sort({ createdAt: -1 });
    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: "No requests found for this complaint" });
    }    
    const payload = requests.map(request => ({
      platform: request.requests.platform,
      requestType: request.requests.requestType,
      targetLink: request.requests.targetLink,
      reason: request.requests.reason,
      referenceId: request.requests.referenceId,
      ackAt: request.requests.ackAt,
      createdAt: request.createdAt,
      doneAt: request.requests.doneAt,
      status: request.requests.status,  
    }));
    // Return the requests in the response
    console.log("Requests found:", requests.length);
    console.log("Payload:", payload);
    // Return the requests in the response
    res.status(200).json({
      success: true,
      requests: payload,
      message: "Requests retrieved successfully"
    });
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
