const User = require("../models/User");
const AdditionDetails = require("../models/AdditionDetails");
const SuspectSchema = require("../models/SuspectSchema");
const VictimDetails = require("../models/Victim");
const Complaint = require("../models/Complaint");
require('dotenv').config();

//admin dashboard
exports.dashboard = async (req, res) => {
    try {
        const additionalDetails = await AdditionDetails.find()
            .select('userId complainId street') // ✅ Selecting fields from AdditionDetails
            .populate({
                path: 'complainIds',               // ✅ Populate complainId reference
                select: 'category subCategory status priority assignedTo', // ✅ Selecting fields from Complaint
            });
        //set priority

        res.status(200).json({
            success: true,
            message: "Admin Dashboard data fetched successfully",
            data: additionalDetails,            
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


// specific user details
exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id; // Get user ID from request parameters    
        const user = await User.findById(userId)
            .select('userName email number') 
           
        const additionalDetails = await AdditionDetails.findOne({ userId: userId })
            .select('documentId street state district pincode')
    .populate('complainIds', 'category subCategory status priority assignedTo lost_money delay_in_report reason_of_delay description screenShots' ); 
     
        
    res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            data: {
                user: user,
                additionalDetails: additionalDetails
            }
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    
    }
};



// Get Monthly Complaint Stats
exports.getMonthlyComplaintStats = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$incident_datetime" },
            month: { $month: "$incident_datetime" }
          },
          total: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: 1
            }
          },
          total: 1,
          resolved: 1
        }
      }
    ]);

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ Error in getMonthlyComplaintStats:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
            