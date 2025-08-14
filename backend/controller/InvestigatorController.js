const Investigator = require("../models/InvestigatorSchema");
const AdditionDetails = require("../models/AdditionDetails");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const mongoose = require('mongoose');
const caseNoteSchema = require("../models/caseNoteSchema ");

require('dotenv').config();

exports.createInvestigator = async (req, res) => {
    try {
        const { name, badgeId, email, phone, password, station, specialistIn, isActive = 1 } = req.body;
        const investigator = new Investigator({
            name,
            badgeId,
            email,
            phone,
            password,
            station,
            specialistIn,
            isActive
        });
        await investigator.save();

        // Create a User entry for the investigator
        const user = new User({
            userName: name,
            email,
            number: phone,
            accountType: "Officer",
            additionDetails: investigator._id // Link to the investigator's details
        });
        await user.save();
        res.status(201).json({
            success: true,
            message: "Investigator created successfully",
            data: investigator
        });
    } catch (error) {
        console.error("Error creating investigator:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.getInvestigatorDetails = async (req, res) => {
    try {
        const investigatorId = req.params.badgeId;
        const investigator = await Investigator.findOne({ investigatorId })
            .select('name badgeId email phone station specialistIn isActive assignedCases')
            .populate('assignedCases.caseId');

        if (!investigator) {
            return res.status(404).json({
                success: false,
                message: "Investigator not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Investigator details fetched successfully",
            data: investigator
        });
    } catch (error) {
        console.error("Error fetching investigator details:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.getAllInvestigators = async (req, res) => {
    try {
        const investigators = await Investigator.find()
            .select('name badgeId email phone station specialistIn isActive assignedCases')
            .populate('assignedCases.caseId')
            .select('category subCategory status priority createdAt');

        //aggregate functions
        const totalInvestigator = Investigator.countDocuments();
        const activeInvestigator = Investigator.countDocuments({ isActive: true });


        res.status(200).json({
            success: true,
            message: "All investigators fetched successfully",
            data: investigators,
            totalInvestigator: totalInvestigator,
            activeInvestigator: activeInvestigator
        });
    } catch (error) {
        console.error("Error fetching all investigators:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.updateInvestigatorStatus = async (req, res) => {
    try {
        const investigatorId = req.params.id;
        const { isActive } = req.body;

        let badgeObjectId = investigatorId;
        if (!mongoose.Types.ObjectId.isValid(investigatorId)) {
            // If badgeId is not a valid ObjectId, try to find by badgeId field
            // Otherwise, convert to ObjectId
        } else {
            badgeObjectId = mongoose.Types.ObjectId(investigatorId);
        }

        const investigator = await Investigator.findOneAndUpdate({ badgeId: badgeObjectId }, {
            isActive
        }, { new: true });

        if (!investigator) {
            return res.status(404).json({
                success: false,
                message: "Investigator not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Investigator updated successfully",
            data: investigator
        });
    }
    catch (error) {
        console.error("Error updating investigator:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
exports.allAssignedCases = async (req, res) => {
    try {
        const investigatorId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(investigatorId)) {
            return res.status(400).json({ success: false, message: "Invalid Investigator ID format" });
        }

        // 1. Investigator ke assigned case IDs
        const investigator = await Investigator.findById(investigatorId).select("assignedCases.caseId assignedCases.assignedAt");
        if (!investigator) {
            return res.status(404).json({ success: false, message: "Investigator not found" });
        }
        // console.log("Investigator:", investigator);
        const assignedCaseIds = investigator.assignedCases.map(c => c.caseId);

        // console.log("Assigned Case IDs:", assignedCaseIds);

        if (!assignedCaseIds.length) {
            return res.status(200).json({
                success: true,
                message: "No cases assigned",
                activeCases: [],
                resolvedCases: []
            });
        }

        // 2. Complaint schema se data
        const complaints = await Complaint.find({ _id: { $in: assignedCaseIds } })
            .select('userId category subCategory status priority description createdAt screenShots complain_report');

        // const complaint = await Complaint.find({ _id: { $in: assignedCaseIds } })
        //            console.log("Complaints:", complaint)

        // console.log("Assigned Cases:", complaints);
        const activeCases = [];
        const resolvedCases = [];
        let pendingActions=0;
        let investigatingCases =0;
        // 3. Har complaint ke liye AdditionalDetails fetch
        for (const c of complaints) {
            const userDetails = await AdditionDetails.findOne({ userId: c.userId })
                .select('fullName street district state pincode');

            // Find assignedAt for this case
            const assignedCase = investigator.assignedCases.find(ac => ac.caseId.toString() === c._id.toString());
            const assignedAt = assignedCase ? assignedCase.assignedAt : null;

            const caseData = {
                id: c._id,
                userId: c.userId,
                caseId: `CASE-${c.createdAt.getFullYear()}-${String(c._id).slice(-3)}`,
                priority: c.priority,
                status: c.status,
                crimeType: c.subCategory,
                location: userDetails ? `${userDetails.street || ''}, ${userDetails.district || ''}, ${userDetails.state || ''}`.trim() : "N/A",
                pinCode: userDetails?.pincode || "N/A",
                userName: userDetails?.fullName || "N/A",
                description: c.description,
                dateReceived: assignedAt || c.createdAt,  // Use assignedAt if found, else fallback to complaint creation date
                evidence: Array.isArray(c.screenShots) ? c.screenShots : 'N/A',
                complaint_report: c.complain_report || 'N/A'
            };
            if(c.status==="AssignInvestigator") pendingActions++;
            if(c.status==="In_review") investigatingCases++;

            // Separate into active and resolved cases
            if (c.status?.toLowerCase() === "resolved") {
                resolvedCases.push(caseData);
            } else {
                activeCases.push(caseData);
            }
        }


        return res.status(200).json({
            success: true,
            message: "Assigned cases fetched successfully",
            activeCases,
            resolvedCases,
            pendingActions,
            investigatingCases,
        });

    } catch (error) {
        console.error("Error fetching assigned cases:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

//update complain
exports.updateComplaintStatus = async (req, res) => {
    try {
        const { complaintId, newStatus, remark } = req.body;

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            complaintId,
            {
                status: newStatus,
                $push: {
                    statusHistory: {
                        status: newStatus,
                        remark,
                        updatedAt: new Date(),
                    }
                },
            },
            { new: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json({success:true, message: "Status updated successfully", data: updatedComplaint });
    } catch (error) {
        console.error("Error updating complaint status:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.AddCaseNoteSchema = async (req, res) => {
    try {
        const { complaintId, investigatorId, note } = req.body;

        if (!complaintId || !investigatorId || !note) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newNote = new caseNoteSchema({
            caseId:complaintId,
            investigatorId,
            noteText:note,
            createdAt: new Date()
        });

        await newNote.save();

        res.status(201).json({ message: "Case note added successfully", data: newNote });
    } catch (error) {
        console.error("Error adding case note:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


exports.getCaseNotes = async (req, res) => {
    try {
        const { complaintId } = req.query;
        console.log("Fetching notes for complaintId:", complaintId);

        const notes = await caseNoteSchema.find({caseId:complaintId })
            .populate("investigatorId", "name")
            .sort({ createdAt: 1 });
        console.log("Notes:", notes);
        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

