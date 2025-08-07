const User = require("../models/User");
const AdditionDetails = require("../models/AdditionDetails");
const SuspectSchema = require("../models/SuspectSchema");
const VictimDetails = require("../models/Victim");
const Complaint = require("../models/Complaint");
const Investigator = require("../models/InvestigatorSchema");
require('dotenv').config();

//admin dashboard
exports.dashboard = async (req, res) => {
  try {
    const additionalDetails = await AdditionDetails.find()
      .select('userId complainIds street')
      .populate({
        path: 'complainIds',
        select: 'category subCategory status priority assignedTo',
        populate: {
          path: 'assignedTo',
          select: 'name specialistIn'
        }
      });

    if (!additionalDetails) {
      return res.status(404).json({
        success: false,
        message: "No additional details found"
      });
    }

    // Aggregate to get total complaints
    const totalComplaints = await Complaint.countDocuments();

    res.status(200).json({
      success: true,
      message: "Admin Dashboard data fetched successfully",
      data: additionalDetails,
      totalComplaints: totalComplaints
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
      .populate('complainIds', 'category subCategory status priority assignedTo lost_money delay_in_report reason_of_delay description screenShots');


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


// Get Monthly User Registration Stats
exports.suggestInvestigator = async (req, res) => {
  try {
    const investigators = await Investigator.find();
    //filter if investigator is not active
    const activeInvestigators = investigators.filter(inv => inv.isActive);

    const data = activeInvestigators.map((investigator, index) => ({
      id: index + 1,
      name: investigator.name,
      email: investigator.email,
      activeCases: investigator.assignedCases.length,
      solvedCases: investigator.solvedCases.length,
      performance: activeCases/(activeCases + solvedCases) * 100, // Calculate performance as a percentage
      specializations: investigator.specialistIn,
      status: activeCases == 0 ? "Free" : (activeCases < 3 ? "Available" : "Busy")
    }));

    //sort by performance
    data.sort((a, b) => b.performance - a.performance);
    //limit to top 5 investigators
    data = data.slice(0, 5);
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("❌ Error fetching investigator stats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// visualize for subcategory cases(like financial fraud, cyber crime, etc.)
exports.subCategoryStats = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      {
        $group: {
          _id: "$subCategory",
          total: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { total: -1 }
      },  
      {
        $project: {
          _id: 0,
          subCategory: "$_id",
          total: 1,
          resolved: 1,
          performance: {
            $multiply: [
              { $divide: ["$resolved", "$total"] },
              100
            ]
          }
        }
      }
    ]); 
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ Error in subCategoryStats:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }

};


exports.mapVisualize= async (req, res) => {
  try {
    // Aggregate complaints by pincode using AdditionDetails and Complaint
    const pinStats = await AdditionDetails.aggregate([
      {
      $lookup: {
        from: "complaints",
        localField: "complainIds",
        foreignField: "_id",
        as: "complaints"
      }
      },
      {
      $group: {
        _id: "$pincode",
        cases: { $sum: { $size: "$complaints" } }
      }
      }
    ]);

    // Determine severity based on number of cases
    const getSeverity = (cases) => {
      if (cases >= 18) return "High";
      if (cases >= 10) return "Medium";
      return "Low";
    };

    // Format response
    const pinData = pinStats
      .filter(stat => stat._id) // Remove entries with no pincode
      .map(stat => ({
      pin: stat._id,
      severity: getSeverity(stat.cases),
      cases: stat.cases
      }));

    res.status(200).json({ success: true, data: pinData });

  }
  catch (err) {
    console.error("❌ Error in mapVisualize:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


