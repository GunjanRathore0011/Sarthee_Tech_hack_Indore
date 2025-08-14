const mongoose = require("mongoose");
const User = require("./User"); // Assuming User model is in the same directory

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: {
        type: String,
        // required: true,
        trim: true,
    },
    rating:{
        type :Number,
        required : true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("Feedback", feedbackSchema);