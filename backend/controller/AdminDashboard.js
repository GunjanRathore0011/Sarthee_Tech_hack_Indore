const User = require("../models/User");
const AdditionDetails = require("../models/AdditionDetails");
const SuspectSchema = require("../models/SuspectSchema");
const VictimDetails = require("../models/Victim");
const Complaint = require("../models/Complaint");
require('dotenv').config();

exports.dashboard = async (req, res) => {
    try {
        const additionalDetails = await AdditionDetails.find()
            .select('userId complainId street') // ✅ Selecting fields from AdditionDetails
            .populate({
                path: 'complainId',               // ✅ Populate complainId reference
                select: 'category subCategory status ', // ✅ Selecting fields from Complaint
            });
        //set priority
        additionalDetails.    

        res.status(200).json({
            success: true,
            message: "Admin Dashboard data fetched successfully",
            data: additionalDetails,
            priority: "Medium" // ✅ Setting priority
        });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};








