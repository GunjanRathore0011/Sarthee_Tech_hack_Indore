const Complaint = require("../models/Complaint");

exports.updateComplaintStatus = async (req, res) => {
  const { complaintId } = req.params;
  const { newStatus, remark } = req.body;

  await Complaint.findByIdAndUpdate(complaintId, {
    status: newStatus,
    $push: {
      statusHistory: {
        status: newStatus,
        remark,
        updatedAt: new Date()
      }
    }
  });

  res.status(200).json({ message: "Status updated successfully" });
};
