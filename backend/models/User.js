const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        // trim: true,
    },
     email: {
        type: String,
        required: true,
        trim: true,
    },
    number: {
        type: Number,
        required: true,
        trim: true,
    },
    accountType: {
        type: String,
        enum: ["User", "Officer"],
        required: true,
    },
    additionDetails: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "Profile",
    },
       

});

module.exports = mongoose.model("User", userSchema);