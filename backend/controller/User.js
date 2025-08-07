const Complaint = require("../models/Complaint");
const AdditionDetails = require("../models/AdditionDetails");

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