const User = require("../models/User");
const AdditionDetails = require("../models/AdditionDetails");
const SuspectSchema = require("../models/SuspectSchema");
const VictimDetails = require("../models/Victim");
const Complaint = require("../models/Complaint");
const UploadToCloudinary = require("../utils/UploadToCloudinary");
require('dotenv').config();

exports.additionalDetails = async (req, res) => {
    try {
        const { fullName, dob, gender, house, street, colony, state, district, policeStation, pincode } = req.body;
        
        if (!fullName || !dob || !house || !street || !colony || !state || !district || !policeStation || !pincode) {
            return res.status(400).json({
                message: "all information are required",
                success: false,
            });
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

//complaint information
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
        } = req.body;

        // ✅ Validate required fields
        if (!category || !subCategory || lost_money === undefined || !description || !incident_datetime) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // ✅ Get user and complaint
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        const complainId = await Complaint.findOne({ userId: user._id });
        if (!complainId) {
            return res.status(404).json({
                message: "Complaint not found",
                success: false,
            });
        }

        // ✅ Upload files to Cloudinary if they exist
        const imageUrls = [];

        if (req.files && req.files.file) {
    const fileData = req.files.file;
    const filesArray = Array.isArray(fileData) ? fileData : [fileData];

    for (let file of filesArray) {
        const uploaded = await UploadToCloudinary(file.tempFilePath, "evidence");
        imageUrls.push(uploaded.secure_url);
    }
}


        // ✅ Create complaint information record
        const complaintInfo = await Complaint.create({
            userId: user._id,
            complainId: complainId._id,
            category,
            subCategory,
            lost_money,
            delay_in_report,
            reason_of_delay,
            description,
            screenShots: imageUrls, // array can be empty if no files uploaded
            incident_datetime,
        });

        return res.status(201).json({
            message: "Complaint information added successfully",
            success: true,
            data: complaintInfo,
        });

    } catch (error) {
        console.error("❌ Error in complaintInformation:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
};

// suspected information
exports.suspectedInformation = async (req, res) => {
    try {
        const { suspectedName, suspectedCard, suspectedCardNumber } = req.body;

        // Validate required fields
        if (!suspectedName || !suspectedCard || !suspectedCardNumber) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        // Get user ID from the session
        const userId = req.user.userId;

        // Get complain ID
        const complainId = await Complaint.findOne({ userId });
        if (!complainId) {
            return res.status(404).json({
                message: "Complaint not found",
                success: false,
            });
        }

        // 🔄 Upload images only if present
        const imageUrls = [];
        if (req.files && req.files.file) {
            const fileData = req.files.file;
            const filesArray = Array.isArray(fileData) ? fileData : [fileData];

            for (let file of filesArray) {
                const uploaded = await UploadToCloudinary(file.tempFilePath, "suspectedImages");
                imageUrls.push(uploaded.secure_url);
            }
        }

        // 🧾 Save data to MongoDB
        const suspectInfo = await SuspectSchema.create({
            complainId: complainId._id,
            suspectedName,
            suspectedCard,
            suspectedCardNumber,
            suspectedImages: imageUrls, // may be empty array
        });

        return res.status(201).json({
            message: "Suspected information added successfully",
            success: true,
            data: suspectInfo,
        });

    } catch (error) {
        console.error("❌ Error in suspectedInformation:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
};


    // victim information
    exports.victimInformation = async (req, res) => {
        try {
            const { bankName, accountNumber, ifscCode, transactionId, transactionDate } = req.body;
            if (!bankName || !accountNumber || !ifscCode || !transactionId || !transactionDate) {
                return res.status(400).json({
                    message: "All fields are required",
                    success: false,
                });
            }
            const userId = req.user.userId; // Get user ID from the authenticated session

            const complainId = await Complaint.findOne({ userId: userId });
            if (!complainId) {
                return res.status(404).json({
                    message: "Complaint not found",
                    success: false,
                });
            }

            // Create victim information
            const victimInfo = await VictimDetails.create({
                complainId: complainId._id, // Associate with the user
                bankName,
                accountNumber,
                ifscCode,
                transactionId,
                transactionDate,
                // screenshots,
            });
            res.status(201).json({
                message: "Victim information added successfully",
                success: true,
                data: victimInfo,
            });
        } catch (error) {
            console.error("Error in victimInformation:", error.message);
            res.status(500).json({
                message: "Internal server error",
                success: false,
                error: error.message,
            });
        }

    };

