const User = require("../models/User");
const AdditionDetails = require("../models/AdditionDetails");
const SuspectSchema = require("../models/SuspectSchema");
const VictimDetails = require("../models/Victim");
const Complaint = require("../models/Complaint");
const InvestigatorSchema =require("../models/InvestigatorSchema")
const Investigator = require("../models/InvestigatorSchema");
require('dotenv').config();
const { io } = require("../index.js"); 




//admin dashboard
// exports.dashboard = async (req, res) => {
//   try {
    
//   const additionalDetails = await AdditionDetails.find()
//       .select('userId complainIds street ')
//       .populate({
//       path: 'complainIds',
//       select: 'category subCategory status priority assignedTo createdAt ',
//       populate: {
//         path: 'assignedTo',
//         select: 'name specialistIn'
//       }
//       });

//       if (!additionalDetails) {
//       return res.status(404).json({
//         success: false,
//         message: "No additional details found"
//       });
//     }
//     // Flatten and format for frontend
//     const formattedComplaints = [];
//     additionalDetails.forEach(detail => {
//       detail.complainIds.forEach(complaint => {
//       formattedComplaints.push({
//         _id: complaint._id,
//         category: complaint.subCategory,
//         location: complaint.street || detail.district || detail.state || detail.street || "",
//         priority: complaint.priority,
//         status: complaint.status,
//         assignedTo: complaint.assignedTo?.name || null,
//         createdAt: complaint.createdAt
//       });
//       });
//     });

//     // Sort complaints by createdAt date ,new data first      
//     formattedComplaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));  

//     // Aggregate to get total complaints , solve complain , highest prioritycases cases remaining,total investigators
//     const totalInvestigators = await Investigator.countDocuments();
//     const activeInvestigators = await Investigator.countDocuments({ isActive: true });
//     const totalComplaints = await Complaint.countDocuments();
//     const solvedComplaints = await Complaint.countDocuments({ status: "Resolved" });
//     const highestPriorityCasesRemaining = await Complaint.countDocuments({
//   priority: "High",
//   status: { $ne: "Resolved" }
// });
//     res.status(200).json({
//       success: true,
//       message: "Admin Dashboard data fetched successfully",
//       data: formattedComplaints,
//       totalComplaints: totalComplaints,
//       solvedComplaints: solvedComplaints,
//       highestPriorityCasesRemaining: highestPriorityCasesRemaining,
//       totalInvestigators: totalInvestigators,
//       activeInvestigators: activeInvestigators
//           });

//   } catch (error) {
//     console.error("Error fetching dashboard data:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// exports.dashboardf = async (req, res) => {
//   try {
//     const { category, status, priority, assignedTo, month } = req.query;
//     // Build filter object for complaints
//     const complaintFilter = {};
//     if (category) complaintFilter.category = category;
//     if (status) complaintFilter.status = status;
//     if (priority) complaintFilter.priority = priority;
//     if (assignedTo) complaintFilter.assignedTo = assignedTo;
//     if (month) {
//       const year = new Date().getFullYear();
//       const startDate = new Date(year, month - 1, 1);
//       const endDate = new Date(year, month, 0, 23, 59, 59, 999);
//       complaintFilter.createdAt = { $gte: startDate, $lte: endDate };
//     }

//     // Find all AdditionDetails and populate complaints with filter
//     const additdionalDetails = await AdditionDetails.find()
//       .select('userId complainIds street')
//       .populate({
//         path: 'complainIds',
//         match: complaintFilter, // Only populate complaints matching filter
//         select: 'category subCategory status priority assignedTo createdAt',
//         populate: {
//           path: 'assignedTo',
//           select: 'name specialistIn'
//         }
//       });

//     if (!additionalDetails || additionalDetails.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No additional details found"
//       });
//     }

//     // Flatten and format for frontend
//     const formattedComplaints = [];
//     additionalDetails.forEach(detail => {
//       detail.complainIds.forEach(complaint => {
//         formattedComplaints.push({
//           _id: complaint._id,
//           category: complaint.subCategory,
//           location: complaint.street || detail.district || detail.state || detail.street || "",
//           priority: complaint.priority,
//           status: complaint.status,
//           assignedTo: complaint.assignedTo?.name || null,
//           createdAt: complaint.createdAt
//         });
//       });
//     });

//     // Sort complaints by createdAt date, newest first
//     formattedComplaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     res.status(200).json({
//       success: true,
//       message: "Filtered complaints fetched successfully",
//       data: formattedComplaints
//     });
//   } catch (error) {
//     console.error("Error filtering complaints:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };


exports.dashboard = async (req, res) => {
  try {
    const { subCategory, status, priority, month ,startIndex=0 } = req.query;

    // Build filter dynamically for Complaint
    const complaintFilter = {};

    if (subCategory) complaintFilter.subCategory = subCategory;
    if (status) complaintFilter.status = status;
    if (priority) complaintFilter.priority = priority;
    // if (assignedTo) complaintFilter.assignedTo = assignedTo;

    // Month filter (by createdAt)
   if (month) {
    const monthInt = parseInt(month, 10);
    const year = new Date().getFullYear();
    const startDate = new Date(year, monthInt - 1, 1);
    const endDate = new Date(year, monthInt, 0, 23, 59, 59);
    complaintFilter.createdAt = { $gte: startDate, $lte: endDate };
}
    // Fetch additional details + complaints with filters
    const additionalDetails = await AdditionDetails.find()
      .select('userId complainIds street district state')
      .populate({
        path: 'complainIds',
        match: Object.keys(complaintFilter).length ? complaintFilter : {}, // apply filter only if given
        select: 'category subCategory status priority assignedTo createdAt',
        populate: {
          path: 'assignedTo',
          select: 'name specialistIn'
        }
      });

    if (!additionalDetails.length) {
      return res.status(404).json({
        success: false,
        message: "No additional details found"
      });
    }

    // Flatten + format
    const formattedComplaint = [];
    additionalDetails.forEach(detail => {
      detail.complainIds.forEach(complaint => {
        formattedComplaint.push({
          _id: complaint._id,
          category: complaint.subCategory,
          location:
            complaint.street ||
            detail.district ||
            detail.state ||
            detail.street ||
            "",
          priority: complaint.priority,
          status: complaint.status,
          assignedTo: complaint.assignedTo?.name || null,
          createdAt: complaint.createdAt
        });
      });
    });

    let formattedComplaints;
    
    // Sort newest first
    if(formattedComplaint.length<startIndex){
   formattedComplaints =formattedComplaint.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(-10)
    }
    else{
   formattedComplaints=  formattedComplaint.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(startIndex,startIndex+10)
    }

    // Dashboard metrics
    const totalInvestigators = await Investigator.countDocuments();
    const activeInvestigators = await Investigator.countDocuments({ isActive: true });
    const totalComplaints = await Complaint.countDocuments();
    const solvedComplaints = await Complaint.countDocuments({ status: "Resolved" });
    const highestPriorityCasesRemaining = await Complaint.countDocuments({
      priority: "High",
      status: { $ne: "Resolved" }
    });

    res.status(200).json({
      success: true,
      message: "Admin Dashboard data fetched successfully",
      data: formattedComplaints,
      totalComplaints,
      solvedComplaints,
      highestPriorityCasesRemaining,
      totalInvestigators,
      activeInvestigators
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({
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


//assign investigator to complaint
exports.assignInvestigator = async (req, res) => {
  try {
    const { complaintId, investigatorId ,remark=''} = req.body;
    if (!complaintId || !investigatorId) {
      return res.status(400).json({
        success: false,
        message: "Complaint ID and Investigator ID are required."
      });
    }
    const complain= await Complaint.findById(complaintId);
    if (!complain) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found."
      });
    }
    complain.assignedTo = investigatorId;
    // Update the status to 'assignInvestigator'
    complain.status = 'AssignInvestigator';
    // Add to status history
    complain.statusHistory.push({
      status: 'AssignInvestigator',
      remark: `Assigned to investigator ( Id : ${investigatorId})`,
      updatedAt: new Date()
    });

    //assign to the investigator
    const investigator = await InvestigatorSchema.findById(investigatorId)
    if (investigator) {
      investigator.assignedCases.push({
      caseId: complaintId,
      assignedAt: new Date(),
      remarks: remark || ''
      });
      await investigator.save();
    }
   
    await complain.save();
   
     io.emit("complaint_assigned", {
    investigatorId,
    complaintId,
    message: `New complaint assign : ${complaintId}`
  });

    res.status(200).json({
        success: true,
        message: "Investigator assigned successfully.",
        data: {
            complaintId: complain._id,
            assignedTo: investigatorId
        }
    });
  } catch (error) {
    console.error("❌ Error in assignInvestigator:", error);
    res.status(500).json({
      success: false,
        message: `Internal Server Error ${error.message}`
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

    const data2 = activeInvestigators.map((investigator, index) => ({
      id: index + 1,
      name: investigator.name,
      email: investigator.email,
      activeCases: investigator.assignedCases.length,
      solvedCases: investigator.solvedCases.length,
      performance: (investigator.assignedCases.length)/((investigator.assignedCases.length) + (investigator.solvedCases.length)) * 100, // Calculate performance as a percentage
      specializations: investigator.specialistIn,
      status: (investigator.assignedCases.length) == 0 ? "Free" : (investigator.assignedCases.length < 3 ? "Available" : "Busy")
    }));
   
    if (data2.length === 0) {
      return res.status(404).json({ success: false, message: "No active investigators found" });
    }
    
       let data = data2;
    
    if(data2.length>5){
     data = data2
    .sort((a, b) => b.performance - a.performance) // highest performance first
    .slice(0, 5); // take top 5
    }
    
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


