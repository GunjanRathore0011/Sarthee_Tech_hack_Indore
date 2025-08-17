const User = require("../models/User");
const AdditionDetails = require("../models/AdditionDetails");
const SuspectSchema = require("../models/SuspectSchema");
const VictimDetails = require("../models/Victim");
const UploadToCloudinary = require("../utils/UploadToCloudinary");
const Complaint = require("../models/Complaint");
require('dotenv').config();
const { io } = require("../index.js");
const fs = require('fs');
// const checkAndCreateAlerts = require("../utils/pattern.js");
const { checkAndCreateAlerts } = require("../utils/pattern.js");
const axios = require('axios');
const path = require('path');
const puppeteer = require('puppeteer');
const cloudinary = require('cloudinary').v2;


// import Jimp from "jimp";
const Jimp = require('jimp');
const Tesseract = require('tesseract.js');

//import virusTotal functions
const { scanBufferWithVT  } = require("../utils/virusTotal.js");

const jsQR = require("jsqr");

async function detectAadhaarFromBuffer(fileBuffer) {
  // ===== 1️⃣ Load Image from Buffer =====
  console.log("Buffer length:", fileBuffer.length);
  console.log("First 20 bytes:", fileBuffer.toString("hex", 0, 20));

  let image;
  try {
    image = await Jimp.read(fileBuffer);
  } catch (err) {
    console.error("Jimp failed to read buffer:", err);
    throw new Error("Invalid image type or corrupted file");
  }

  // ===== 2️⃣ OCR Detection (Hindi + English) =====
  console.log("🔍 Running OCR...");
  const { data: { text } } = await Tesseract.recognize(fileBuffer, "hin+eng");

  console.log("\n🔍 OCR Extracted Text:\n", text);

  const aadhaarKeywords = [
    "government of india",
    "भारत सरकार",
    "मेरी आधार मेरी पहचान",
    "dob",
    "आधार",
    "aadhaar",
    "sex",
    "xxxx",
    "name" // Example pattern for Aadhaar number, adjust as needed
  ];

  const textLower = text.toLowerCase();
  const textMatch = aadhaarKeywords.some(keyword =>
    textLower.includes(keyword.toLowerCase())
  );

  // ===== 3️⃣ QR Code Presence Check =====
  console.log("📷 Checking QR Code...");
  let qrFound = false;

  try {
    const imageData = {
      data: new Uint8ClampedArray(image.bitmap.data),
      width: image.bitmap.width,
      height: image.bitmap.height,
    };

    // jsQR will return an object if a QR code pattern is found
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    
    // We only need to check if the 'code' object exists
    if (code) {
      qrFound = true;
    }
  } catch (err) {
    console.error("jsQR failed to detect QR code:", err);
  }

  // ===== 4️⃣ Final Decision =====
  console.log(`OCR Keyword Match: ${textMatch}`);
  console.log(`QR Code Found: ${qrFound}`);
  return textMatch && qrFound;
}


exports.additionalDetails = async (req, res) => {
  try {
    console.log("Received additional details request:", req.body);
    const { fullName, dob, gender, house = "", street, colony = "", state, district = "", policeStation, pincode } = req.body;
    console.log("Received additional details:", req.body);

    if (!fullName || !dob || !house || !street || !colony || !district || !policeStation || !pincode) {
      return res.status(400).json({
        message: "All information is required",
        success: false,
      });
    }
    console.log("Received additional details:",);
    // 👇 Declare uploaded in outer scope
    let uploaded = null;
    let scan = null;
    if (req.files && req.files.file) {
      const fileData = req.files.file;

      // ✅ File buffer banao (express-fileupload me "data" hota hai)
      const fileBuffer = fileData.data;
      const originalName = fileData.name;

      // STEP 1: VirusTotal scan
      scan = await scanBufferWithVT(fileBuffer, originalName);
      console.log("VirusTotal Scan Result:", scan);

      // STEP 2: Decision (block if high-risk)
      if (scan.verdict === "high-risk") {
        return res.status(400).json({
          success: false,
          message: "File blocked: malicious content detected",
          vtLink: scan.vtLink,
          stats: scan.stats
        });
      }

      uploaded = await UploadToCloudinary(fileData, "governmentId");

      if (!uploaded || !uploaded.secure_url) {
        return res.status(500).json({
          message: "Failed to upload file",
          success: false,
        });
      }
    }
    console.log("File uploaded to Cloudinary:", uploaded);

    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const addDetails = await AdditionDetails.create({
      userId: user._id,
      fullName,
      documentId: uploaded?.secure_url || null, // ✅ handle optional file
      dob,
      gender,
      street,
      colony,
      house,
      state,
      district,
      policeStation,
      pincode,
      // ✅ VirusTotal metadata (add fields in schema)
      vtSha256: scan?.sha256 || null,
      vtVerdict: scan?.verdict || null,
      vtLink: scan?.vtLink || null
    });

    res.status(201).json({
      message: "Additional details added successfully",
      success: true,
      data: addDetails,
    });

  } catch (error) {
    console.error("Error in additionalDetails:", error.message);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// ✅ SINGLE API: COMPLAINT INFORMATION
exports.complaintInformation = async (req, res) => {
  try {
    // ✅ Parse JSON from FormData
    let body;
    if (req.body.data) {
      try {
        body = JSON.parse(req.body.data);
      } catch (err) {
        return res.status(400).json({ message: "Invalid JSON format", success: false });
      }
    } else {
      body = req.body; // Fallback (non-formdata)
    }

    const {
      category,
      subCategory,
      lost_money,
      delay_in_report,
      reason_of_delay,
      description,
      incident_datetime,
      bankName,
      accountNumber,
      ifscCode,
      transactionId,
      transactionDate,
      suspectedName = "",
      suspectedCard = "",
      suspectedCardNumber = ""
    } = body;

    // ✅ Validate required fields
    if (!category || !subCategory || !description || !incident_datetime) {
      return res.status(400).json({
        message: "Required fields missing: category, subCategory, description, incident_datetime",
        success: false,
      });
    }

    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    // ✅ Upload evidence images with VirusTotal check
    let imageUrls = [];   // safe files (Cloudinary URLs)
    let riskFiles = [];   // risky files (VirusTotal flagged)

    // console.log("Received file:", req.files);

    if (req.files?.file) {
      const filesArray = Array.isArray(req.files.file)
        ? req.files.file
        : [req.files.file];

      for (let file of filesArray) {
        // ✅ 1. Skip truncated (too big) files
        if (file.truncated) {
          console.warn(`⛔ Skipping ${file.name} - File size exceeds limit`);
          continue;
        }
    //  console.log("pdf file :",file); 
        try {
          // ✅ 2. First scan file with VirusTotal
          const riskLevel = await scanBufferWithVT(file.data, file.name);
          // 👉 scanWithVirusTotal = helper fn that returns "safe" | "high-risk"
            const uploaded = await UploadToCloudinary(file, "evidence");
            console.log("file url", uploaded.secure_url);

      //  console.log(`File ${file.name} scanned with VT:`, riskLevel);
          if (riskLevel.verdict !== "high-risk") {
            // ✅ 3. Safe → upload to Cloudinary
            // const uploaded = await UploadToCloudinary(file, "evidence");
            console.log(`✅ Uploading SAFE file: ${uploaded.secure_url}`);
            if (uploaded?.secure_url) {
              imageUrls.push(uploaded.secure_url);
              console.log(`✅ Uploaded SAFE file: ${file.name}`);
            } else {
              console.error(`❌ Upload failed: ${file.name}`);
            }
          } else {
            // 🚨 Risky → don't upload to Cloudinary
            riskFiles.push({
              Url : uploaded?.secure_url || null,
              note: "⚠️ Marked as HIGH-RISK by VirusTotal. Do not open directly."
            });
            console.warn(`🚨 File flagged as risky: ${file.name}`);
          }

        } catch (err) {
          console.error(`❌ Error processing ${file.name}:`, err.message);
        }
      }
    }

    console.log("Final SAFE uploaded URLs:", imageUrls);
    console.log("Final RISKY files:", riskFiles);

    // Later you can save both in DB
    // Complaint.create({ safeFiles: imageUrls, riskFiles });


    let prior = "Medium";
    if ("Harassment" == category) {
    } else {
      prior = lost_money >= 100000 ? "High" : "Low";
    }

    // ✅ Create complaint
    const complaintInfo = await Complaint.create({
      userId,
      category,
      subCategory,
      lost_money,
      delay_in_report,
      reason_of_delay,
      description,
      statusHistory: [{
        status: "Pending",
        remark: "Case registered successfully. Awaiting verification and assignment. The complaint has been received and logged into the system. Our team will initiate the review process shortly",
        updatedAt: new Date()
      }],
      priority: prior,
      screenShots: imageUrls,
      incident_datetime,
      riskFiles:riskFiles,
    });


    console.log("Complaint created:", complaintInfo);
    // ✅ Link complaint to user
    await AdditionDetails.updateOne(
      { userId },
      { $push: { complainIds: complaintInfo._id } },
      { upsert: false }
    );



    //  ---generate pdf-----------
    const additionalDetails = await AdditionDetails.findOne({ complainIds: complaintInfo._id });
    if (!additionalDetails) {
      return res.status(404).json({
        message: "Additional details not found for this complaint",
        success: false,
      });
    }

    // Limit description to ~2 lines (e.g., 150 chars) and add "..." if longer
    const maxDescLength = 100;
    let shortDescription = complaintInfo.description;
    if (shortDescription.length > maxDescLength) {
      shortDescription = shortDescription.slice(0, maxDescLength).trim() + "...";
    }

    const dataset = {
      fullName: additionalDetails.fullName,
      address: `${additionalDetails.colony}, ${additionalDetails.street}`,
      district: additionalDetails.district,
      state: additionalDetails.state,
      pincode: additionalDetails.pincode,
      complaintSummary: shortDescription,
      category: complaintInfo.category,
      crn: complaintInfo._id,
      generatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
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
        {
          folder: "reports",
          resource_type: "image", // treat PDF as an image for inline preview
          public_id: `complaint_${complaintInfo._id}`,
        }, // no resource_type here
        (err, uploadResult) => {
          fs.unlinkSync(tempPath); // cleanup
          if (err) reject(err);
          else resolve(uploadResult);
        }
      );
    });
    // console.log("PDF uploaded to Cloudinary:", result.secure_url);
    // Save result.secure_url in complain_report and persist to DB
    complaintInfo.complain_report = result.secure_url;
    await complaintInfo.save();

    // console.log("Complaint report URL saved:", complaintInfo.complain_report);








    // ✅ Victim Info (optional)
    const victimFields = [bankName, accountNumber, ifscCode, transactionId, transactionDate];
    const hasVictimInfo = victimFields.every(Boolean);
    if (hasVictimInfo) {
      const alreadyExists = await VictimDetails.findOne({ complainId: complaintInfo._id });
      if (!alreadyExists) {
        await VictimDetails.create({
          complainId: complaintInfo._id,
          bankName,
          accountNumber,
          ifscCode,
          transactionId,
          transactionDate,
        });
      }
    }

    // ✅ Suspect Info (optional)
    const suspectFields = [suspectedName, suspectedCard, suspectedCardNumber];
    console.log("Suspect fields:", suspectFields);

    console.log("Suspect files received:", req.files);


    if (suspectedName || suspectedCard || suspectedCardNumber) {
      const alreadyExists = await SuspectSchema.findOne({ complainId: complaintInfo._id });
      if (!alreadyExists) {
        const suspectImages = [];
        if (req.files?.suspect_file) {
          console.log("Suspect files received:", req.files.suspect_file);
          const suspectFiles = Array.isArray(req.files.suspect_file)
            ? req.files.suspect_file
            : [req.files.suspect_file];
          for (let file of suspectFiles) {
            const uploaded = await UploadToCloudinary(file.tempFilePath, "suspectedImages");
            suspectImages.push(uploaded.secure_url);
          }
        }

        const suspect = await SuspectSchema.create({
          complainId: complaintInfo._id,
          suspectedName,
          suspectedCard,
          suspectedCardNumber,
          suspectedImages: suspectImages,
        });
        checkAndCreateAlerts(suspect).catch(err => console.error('Pattern check error', err));
      }
    }

    io.emit("receive_notification", {
      message: "New complaint submitted",
      complaintId: complaintInfo._id
    });

    const Datasend = {
      _id: complaintInfo._id,
      category: complaintInfo.category,
      subCategory: complaintInfo.subCategory,
      reportpdf: complaintInfo.complain_report,
      statusHistory: complaintInfo.statusHistory,
      priority: complaintInfo.priority,
      incident_datetime: complaintInfo.incident_datetime,
      createdAt: complaintInfo.createdAt,
    };

    res.status(201).json({
      message: "✅ Complaint submitted successfully",
      success: true,
      data: Datasend,
    });

  // verify the evidence files
  try {
  const evidences_link = complaintInfo.screenShots || [];
  const flaskResponse = await axios.post(
    "http://127.0.0.1:5000/verifyDocuments",
    { Evidences_link: evidences_link } // send as JSON object
  );

    // Example: assuming Flask returns { isValid: 0 } or { isValid: 1 }
    const isValid = flaskResponse.data.response;
    console.log("Flask verification result:", isValid);
    complaintInfo.isScreenshotTampered= isValid;
    await complaintInfo.save();
  } catch (flaskError) {
    console.error("Flask verification error:", flaskError.message);
    // You can choose to handle this differently, e.g. log it but don't fail the main request
    complaintInfo.isScreenshotTampered = Array(complaintInfo.screenShots.length).fill(0); // default to false if error
    await complaintInfo.save();
  }

  } catch (error) {
    console.error("❌ complaintInformation Error:", error);
    return res.status(500).json({
      message: "❌ Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};
