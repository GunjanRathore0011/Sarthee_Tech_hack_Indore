const User = require("../models/User");
const AdditionDetails = require("../models/AdditionDetails");
const SuspectSchema = require("../models/SuspectSchema");
const VictimDetails = require("../models/Victim");
const UploadToCloudinary = require("../utils/UploadToCloudinary");
const Complaint = require("../models/Complaint");
require('dotenv').config();
const { io } = require("../index.js"); 
const fs = require('fs');

// import Jimp from "jimp";
// import QrCode from "qrcode-reader";
const Jimp = require('jimp');
const QrCode = require('qrcode-reader');
const Tesseract = require('tesseract.js');


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
        "aadhaar"
    ];

    const textLower = text.toLowerCase();
    const textMatch = aadhaarKeywords.some(keyword =>
        textLower.includes(keyword.toLowerCase())
    );

    // ===== 3️⃣ QR Code Presence Check =====
    console.log("📷 Checking QR Code...");
    let qrFound = false;
    await new Promise((resolve) => {
        const qr = new QrCode();
        qr.callback = (err, value) => {
            if (value) qrFound = true; // Found QR
            resolve();
        };
        qr.decode(image.bitmap);
    });

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

    if (!fullName || !dob || !house || !street || !colony ||  !district || !policeStation || !pincode) {
      return res.status(400).json({
        message: "All information is required",
        success: false,
      });
    }
     console.log("Received additional details:", );
    // 👇 Declare uploaded in outer scope
    let uploaded = null;
    if (req.files && req.files.file) {
      const fileData = req.files.file;

    
const fileBuffer = fs.readFileSync(fileData.tempFilePath);
console.log("File buffer length:", fileBuffer);

        const isAadhaar = await detectAadhaarFromBuffer(fileBuffer);
        if (!isAadhaar) {
            return res.status(400).json({ error: "Not a valid Aadhaar card" });
        }


      uploaded = await UploadToCloudinary(fileData.tempFilePath, "governmentId");

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


// //complaint information
// exports.complaintInformation = async (req, res) => {
//     try {
//         const {
//             category,
//             subCategory,
//             lost_money,
//             delay_in_report,
//             reason_of_delay,
//             description,
//             incident_datetime,
//         } = req.body;

//         // ✅ Validate required fields
//         if (!category || !subCategory || lost_money === undefined || !description || !incident_datetime) {
//             return res.status(400).json({
//                 message: "All fields are required",
//                 success: false,
//             });
//         }

//         // ✅ Get user and complaint
//         const userId = req.user.userId;
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found",
//                 success: false,
//             });
//         }



//         // ✅ Upload files to Cloudinary if they exist
//         const imageUrls = [];

//         if (req.files && req.files.file) {
//     const fileData = req.files.file;
//     const filesArray = Array.isArray(fileData) ? fileData : [fileData];

//     for (let file of filesArray) {
//         const uploaded = await UploadToCloudinary(file.tempFilePath, "evidence");
//         imageUrls.push(uploaded.secure_url);
//     }
// }

// console.log("Uploaded image URLs:", imageUrls);

//         // ✅ Create complaint information record
//         const complaintInfo = await Complaint.create({
//             userId: user._id,
//             category,
//             subCategory,
//             lost_money,
//             delay_in_report,
//             reason_of_delay,
//             description,
//             screenShots: imageUrls, // array can be empty if no files uploaded
//             incident_datetime,
//         });
//         console.log("Complaint information created:", complaintInfo);
//         //add additional details reference
//         await AdditionDetails.updateOne(
//             { userId: user._id },
//             { $set: { complainId: complaintInfo._id } }
//         );

//         const { bankName, accountNumber, ifscCode, transactionId, transactionDate } = req.body;
//      if(bankName || accountNumber || ifscCode || transactionId || transactionDate){
//         victimInformation( bankName, accountNumber, ifscCode, transactionId, transactionDate)
//      }
//       const { suspectedName, suspectedCard, suspectedCardNumber } = req.body;
//       if(suspectedName || !suspectedCard || !suspectedCardNumber){
//      suspectedInformation(suspectedName, suspectedCard, suspectedCardNumber);
//       }
//       return res.status(201).json({
//             message: "Complaint information added successfully",
//             success: true,
//             data: complaintInfo,
//         });

//     } catch (error) {
//         console.error("❌ Error in complaintInformation:", error.message);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false,
//             error: error.message,
//         });
//     }
// };

// // victim information
//     const victimInformation = async ( bankName, accountNumber, ifscCode, transactionId, transactionDate) => {
//         try {
//             if (!bankName || !accountNumber || !ifscCode || !transactionId || !transactionDate) {
//                 return res.status(400).json({
//                     message: "All fields are required",
//                     success: false,
//                 });
//             }
//             const userId = req.user.userId; // Get user ID from the authenticated session

//             const complainId = await Complaint.findOne({ userId: userId });
//             if (!complainId) {
//                 return res.status(404).json({
//                     message: "Complaint not found",
//                     success: false,
//                 });
//             }

//             // Create victim information
//             const victimInfo = await VictimDetails.create({
//                 complainId: complainId._id, // Associate with the user
//                 bankName,
//                 accountNumber,
//                 ifscCode,
//                 transactionId,
//                 transactionDate,
//                 // screenshots,
//             });          
//             console.log("Victim information created:", victimInfo);
//         } catch (error) {
//             console.error("Error in victimInformation:", error.message);
//             res.status(500).json({
//                 message: "Internal server error",
//                 success: false,
//                 error: error.message,
//             });
//         }

//     };
// // suspected information
//  const suspectedInformation = async (suspectedName, suspectedCard, suspectedCardNumber) => {
//     try {  

//         // Validate required fields
//         if (!suspectedName || !suspectedCard || !suspectedCardNumber) {
//             return res.status(400).json({
//                 message: "All fields are required",
//                 success: false,
//             });
//         }

//         // Get user ID from the session
//         const userId = req.user.userId;

//         // Get complain ID
//         const complainId = await Complaint.findOne({ userId });
//         if (!complainId) {
//             return res.status(404).json({
//                 message: "Complaint not found",
//                 success: false,
//             });
//         }

//         // 🔄 Upload images only if present
//         const imageUrls = [];
//         if (req.files && req.files.file) {
//             const fileData = req.files.file;
//             const filesArray = Array.isArray(fileData) ? fileData : [fileData];

//             for (let file of filesArray) {
//                 const uploaded = await UploadToCloudinary(file.tempFilePath, "suspectedImages");
//                 imageUrls.push(uploaded.secure_url);
//             }
//         }

//         // 🧾 Save data to MongoDB
//         const suspectInfo = await SuspectSchema.create({
//             complainId: complainId._id,
//             suspectedName,
//             suspectedCard,
//             suspectedCardNumber,
//             suspectedImages: imageUrls, // may be empty array
//         });
//         console.log("Suspected information created:", suspectInfo);

//     } catch (error) {
//         console.error("❌ Error in suspectedInformation:", error.message);
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false,
//             error: error.message,
//         });
//     }
// };



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

    // ✅ Upload evidence images (FormData key: 'file')
    let imageUrls = [];
    console.log("Received file:", req.files);

    if (req.files?.file) {
      const filesArray = Array.isArray(req.files.file) ? req.files.file : [req.files.file];
      for (let file of filesArray) {
        const uploaded = await UploadToCloudinary(file.tempFilePath, "evidence");
        imageUrls.push(uploaded.secure_url);
      }
    }
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
    });

    // ✅ Link complaint to user
    await AdditionDetails.updateOne(
      { userId },
      { $push: { complainIds: complaintInfo._id } },
      { upsert: false }
    );

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

        await SuspectSchema.create({
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
 

    return res.status(201).json({
      message: "✅ Complaint submitted successfully",
      success: true,
      data: complaintInfo,
    });

  } catch (error) {
    console.error("❌ complaintInformation Error:", error);
    return res.status(500).json({
      message: "❌ Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};
