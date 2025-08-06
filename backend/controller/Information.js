const User = require("../models/User");
const AdditionDetails = require("../models/AdditionDetails");
const SuspectSchema = require("../models/SuspectSchema");
const VictimDetails = require("../models/Victim");
const Complaint = require("../models/Complaint");
const UploadToCloudinary = require("../utils/UploadToCloudinary");
require('dotenv').config();

exports.additionalDetails = async (req, res) => {
    try {
        const { fullName, dob, gender, house="", street, colony="", state, district="", policeStation, pincode } = req.body;
        
        if (!fullName || !dob || !house || !street || !colony || !state || !district || !policeStation || !pincode) {
            return res.status(400).json({
                message: "all information are required",
                success: false,
            });
        }
        // single document file 
        if (req.files && req.files.file) {
            const fileData = req.files.file;
            //upload to cloudinary
            const uploaded = await UploadToCloudinary(fileData.tempFilePath, "governmentId");
            if (!uploaded || !uploaded.secure_url) {
                return res.status(500).json({
                    message: "Failed to upload file",
                    success: false,
                });
            }

        }
        const userId = req.user.userId; // Get user email from the authenticated session
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }
        // Create additional details
        const addDetails = await AdditionDetails.create({
            userId: user._id, // Associate with the user
            fullName,
            documentId: uploaded.secure_url, // Store the uploaded file URL
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
                suspectedName,
                suspectedCard,
                suspectedCardNumber
            } = req.body;

            // ✅ Required fields check
            if (!category || !subCategory ||  !description || !incident_datetime) {
                return res.status(400).json({ message: "Required complaint fields are missing", success: false });
            }

            const userId = req.user.userId;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found", success: false });
            }

            // ✅ Upload screenshots
            const imageUrls = [];
            if (req.files?.file) {
                const filesArray = Array.isArray(req.files.file) ? req.files.file : [req.files.file];
                for (let file of filesArray) {
                    const uploaded = await UploadToCloudinary(file.tempFilePath, "evidence");
                    imageUrls.push(uploaded.secure_url);
                }
            }
            let prior = "Medium";
            if("Harassment"==category){                
            }else{
             prior = lost_money >= 100000 ? "High" :"Normal";
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
                screenShots: imageUrls,
                priority: prior,
                incident_datetime,
            });

            // ✅ Update AdditionalDetails with complaintId
            await AdditionDetails.updateOne(
                { userId },
                { $push: { complainId: complaintInfo._id } },
                { upsert: false } // don't create new if not found
            );

            // ✅ Handle Victim Info only if fields provided
            const victimFields = [bankName, accountNumber, ifscCode, transactionId, transactionDate];
            const hasVictimInfo = victimFields.every(Boolean); // all fields must exist

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

            // ✅ Handle Suspect Info only if fields provided
            const suspectFields = [suspectedName, suspectedCard, suspectedCardNumber];
            const hasSuspectInfo = suspectFields.every(Boolean);

            if (hasSuspectInfo) {
                const alreadyExists = await SuspectSchema.findOne({ complainId: complaintInfo._id });
                if (!alreadyExists) {
                    const suspectImages = [];
                    if (req.files?.suspectFile) {
                        const filesArray = Array.isArray(req.files.suspectFile)
                            ? req.files.suspectFile
                            : [req.files.suspectFile];
                        for (let file of filesArray) {
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
                }
            }

            return res.status(201).json({
                message: "Complaint submitted successfully",
                success: true,
                data: complaintInfo,
            });

        } catch (error) {
            console.error("❌ complaintInformation Error:", error);
            return res.status(500).json({
                message: "Internal Server Error",
                success: false,
                error: error.message
            });
        }
    };
