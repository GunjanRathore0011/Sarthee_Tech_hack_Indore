// models/CaseNote.js
const mongoose = require("mongoose");
const {User } = require('./User'); // Adjust the path as necessary
const Investigator = require('./InvestigatorSchema'); // Adjust the path as necessary


const caseNoteSchema = new mongoose.Schema({
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    investigatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Investigator",
        required: true
    },
    noteText: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("CaseNote", caseNoteSchema);
