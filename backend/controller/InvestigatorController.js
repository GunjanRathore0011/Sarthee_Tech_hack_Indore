const Investigator = require("../models/InvestigatorSchema");
const AdditionDetails = require("../models/AdditionDetails");
const User = require("../models/User");
const mongoose = require('mongoose');
require('dotenv').config();

exports.createInvestigator = async (req, res) => {
    try {
        const { name, badgeId, email, phone, password,station ,specialistIn,isActive=1} = req.body; 
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
            const activeInvestigator =Investigator.countDocuments({isActive: true});


        res.status(200).json({
            success: true,
            message: "All investigators fetched successfully",
            data: investigators,
            totalInvestigator:totalInvestigator,
            activeInvestigator:activeInvestigator
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
        
        const investigator = await Investigator.findOneAndUpdate({ badgeId:badgeObjectId}, {
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

//investigator see all this cases assigned
exports.allAssignedCases = async (req, res) => {
    try {
    const badgeId = req.params.id;
    // console.log(req.params)
        if (!badgeId) {
            return res.status(400).json({
            success: false,
            message: "Investigator ID is required"
            });
        }
        // Convert string badgeId to ObjectId if necessary
        let badgeObjectId = badgeId;
        if (!mongoose.Types.ObjectId.isValid(badgeId)) {
            // If badgeId is not a valid ObjectId, try to find by badgeId field
            // Otherwise, convert to ObjectId
        } else {
            badgeObjectId = mongoose.Types.ObjectId(badgeId);
        }
        console.log(badgeId," ",badgeObjectId);
        
        const investigator = await Investigator.findOne({ badgeId: badgeObjectId })
            // .select('assignedCases')
            // .populate('assignedCases.caseId');

        if (!investigator) {
            return res.status(404).json({
                success: false,
                message: "Investigator not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Assigned cases fetched successfully",
            data: investigator.assignedCases
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