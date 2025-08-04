const mongoose = require("mongoose");
const mailsender = require("../utils/MailSender");
const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            require: true,
        },
        otp: {
            type: String,
            require: true,
        },
        
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 3000,
        }
    }
)

//function send email for otp
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailsender(email, "verification from EdTech", otp);
        console.log(" email send successfully");
    }
    catch (e) {
        console.error("error in send mail :", error.message);
    }
}

otpSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", otpSchema);