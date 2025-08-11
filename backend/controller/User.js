const Complaint = require("../models/Complaint");
const AdditionDetails = require("../models/AdditionDetails");
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const User = require("../models/User");
const Feedback = require("../models/Feedback");
require('dotenv').config();
const cloudinary = require('cloudinary').v2;


// GET /api/v1/complaint/:id/
exports.getComplaintStatus = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Complaint ID is required."
      });
    }

    const complaint = await Complaint.findById(id).select('status statusHistory');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found."
      });
    }

    const latestStatus = complaint.status;
    const history = complaint.statusHistory || [];

    // const latestEntry = history.length > 0 ? history[history.length - 1] : null;

    res.status(200).json({
      success: true,
      complaintId: complaint._id,
      currentStatus: latestStatus,
      //   latestRemark: latestEntry ? latestEntry.remark : 'No remark available.',
      //   lastUpdated: latestEntry ? latestEntry.updatedAt : complaint.updatedAt,
      fullHistory: history
    });

  } catch (err) {
    console.error("❌ Error in getComplaintStatus:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


//get pdf
// controllers/pdfController.js 
const streamifier = require("streamifier");

exports.generateComplaintPDF = async (req, res) => {
  try {
    const { complaintId } = req.body;
    if (!complaintId) {
      return res.status(400).json({ success: false, message: "Complaint ID is required." });
    }

    const complaint = await Complaint.findById(complaintId);
    const additionalDetails = await AdditionDetails.findOne({ complainIds: complaint._id });
    if (!complaint || !additionalDetails) {
      return res.status(404).json({ success: false, message: "Complaint or details not found." });
    }

    const dataset = {
      fullName: additionalDetails.fullName,
      address: `${additionalDetails.colony}, ${additionalDetails.street}`,
      district: additionalDetails.district,
      state: additionalDetails.state,
      pincode: additionalDetails.pincode,
      complaintSummary: complaint.description,
      category: complaint.category,
      crn: complaint._id,
    };

    // Load and replace HTML template
    const templatePath = path.join(__dirname, '..', 'utils', 'complaintTemplate.html');
    let html = fs.readFileSync(templatePath, 'utf-8');
    for (let key in dataset) {
      html = html.replace(`{{${key}}}`, dataset[key]);
    }

    // Generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

const tempPath = path.join(__dirname, "temp.pdf");
fs.writeFileSync(tempPath, pdfBuffer);


    // Upload to Cloudinary (unsigned raw preset)
   const result = await new Promise((resolve, reject) => {
  cloudinary.uploader.unsigned_upload(
    tempPath,
    "public_pdf", // unsigned preset name
    { folder: "reports",
      resource_type: "image", // treat PDF as an image for inline preview
      public_id: `complaint_${complaintId}`,
     }, // no resource_type here
    (err, uploadResult) => {
      fs.unlinkSync(tempPath); // cleanup
      if (err) reject(err);
      else resolve(uploadResult);
    }
  );
});

  
  // Save result.secure_url in complain_report and persist to DB
  complaint.complain_report = result.secure_url;
  await complaint.save();


    res.status(200).json({
      success: true,
      message: "PDF generated and uploaded successfully",
      fileUrl: result.secure_url
    });

  } catch (error) {
    console.error("❌ Error in generateComplaintPDF:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


//save pdf
exports.saveFeedback = async (req, res) => {
    try {
        const {  feedback,rating } = req.body;
        const userId = req.user.userId; // Get user ID from the authenticated session

        // Validate input
        if (!userId || !rating) {
            return res.status(400).json({
                message: "User ID and feedback are required",
                success: false,
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Create new feedback
        const newFeedback = await Feedback.create({
            userId,
            rating,
            feedback,
        });

        res.status(201).json({
            message: "Feedback saved successfully",
            success: true,
            feedback: newFeedback,
        });
    } catch (error) {
        console.error("Error saving feedback:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
}