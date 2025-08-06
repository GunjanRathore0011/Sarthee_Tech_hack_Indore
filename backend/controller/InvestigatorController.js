const Investigator = require("../models/InvestigatorSchema");
const AdditionDetails = require("../models/AdditionDetails");
const User = require("../models/User");
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
            .populate('assignedCases.caseId');
        res.status(200).json({
            success: true,
            message: "All investigators fetched successfully",
            data: investigators
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
        const investigatorId = req.params.badgeId;
        const { isActive } = req.body;
        const investigator = await Investigator.findOneAndUpdate(investigatorId, {
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