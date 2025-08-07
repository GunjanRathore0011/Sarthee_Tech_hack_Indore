const Complaint = require("../models/Complaint");
const AdditionDetails = require("../models/AdditionDetails");
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

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
// module.generateComplaintPDF = async (req, res) => {
//   const {
//     fullName,
//     address,
//     district,
//     state,
//     pincode,
//     complaintSummary,
//     category,
//     crn
//   } = req.body;

//   // Load template
//   const templatePath = path.join(__dirname, '..', 'utils', 'complaintTemplate.html');
//   let html = fs.readFileSync(templatePath, 'utf-8');

//   // Replace variables
//   html = html
//     .replace('{{fullName}}', fullName)
//     .replace('{{address}}', address)
//     .replace('{{district}}', district)
//     .replace('{{state}}', state)
//     .replace('{{pincode}}', pincode)
//     .replace('{{complaintSummary}}', complaintSummary)
//     .replace('{{category}}', category)
//     .replace('{{crn}}', crn);

//   // Launch browser and generate PDF
//   const browser = await puppeteer.launch();

  
//   const page = await browser.newPage();
//   await page.setContent(html, { waitUntil: 'load' });

//   const fileName = `Complaint_${crn || Date.now()}.pdf`;
//   const filePath = path.join(__dirname, '..', 'pdfs', fileName);

//   await page.pdf({
//     path: filePath,
//     format: 'A4',
//     printBackground: true
//   });

//   await browser.close();

//   // Respond with link
//   res.status(200).json({
//     message: 'PDF generated successfully',
//     file: `/pdfs/${fileName}`
//   });
// };



