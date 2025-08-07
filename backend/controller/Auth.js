const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require('otp-generator');
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.signUp = async (req, res) => {
    try {
        const { userName, email, number, otp } = req.body;
        console.log("Received data:", req.body);
        if (!userName || !email || !number || !otp || !otp) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }
        // Check if user already exists
        const existingUser = await User.find({ email });
        if (existingUser.length > 0) {
            return res.status(400).json({
                message: "User already exists",
                success: false,
            });
        } 
        // Validate OTP
        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({
                message: "Invalid OTP",
                success: false,
            });
        }
        // Create new user
        const newUser = await User.create({
            userName,
            email,
            number,
            otp,
            accountType: "User", // Default account type
        });
        //create a session token
        const payload = {
            userId: newUser._id,
            email: newUser.email,
            accountType: newUser.accountType, // Include account type in the payload
        };
        //using jwt to create a token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d" // Token expires in 7 days
        });
        // Save the token in the user's session or database as needed
        req.session.token = token; // Example of saving token in session
        

        // Associate additional details
        res.status(201).json({
            message: "User created successfully",
            success: true,
            user: newUser,
        });
    }
    catch (error) {
        console.error("Error in signUp:", error.message);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
}



//send otp for singup
exports.sendOTPforSignUp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "not get email",
                success: false,
            })
        }
        console.log("your email is ", email)

        const checkUserPresent = await User.findOne({ email });
        //if already exist
        if (checkUserPresent) {
            return (
                res.status(401).json({
                    success: false,
                    message: "user already exist"
                })
            )
        }
        //otp Generator
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })
        console.log("otp is ", otp);

        //checkk its unique otp or not 
        // const result = await OTP.findOne({ otp });

        //recreate otp if previous is not unique
        // while (result) {
        //     otp = otpGenerator.generate(6, {
        //         upperCaseAlphabets: false,
        //         lowerCaseAlphabets: false,
        //         specialChars: false
        //     })
        //     result = OTP.findOne({ otp });
        // }

        //    stored in db 
        const existingOtp = await OTP.findOne({ email });
        if (existingOtp) {
            existingOtp.otp = otp;
            await existingOtp.save();
        }
        else {
            await OTP.create({
                email,
                otp,
            });
        }

        console.log("otp is :", otp);

        //success return
        res.status(200).json({
            success: true,
            message: "otp successfully send",
            otp: otp, // Return the OTP for testing purposes

        })
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: "not get otp",
            error: e.message,
        })
    }
}
//send otp for signin
exports.sendOTPforSignIn = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false,
            });
        }
        console.log("your email is ", email);
        //check user exist or not
        const checkUserPresent = await User.find({ email });
        console.log("check user present", checkUserPresent);
        if (checkUserPresent.length === 0) {
            return res.status(400).json({
                message: "User does not exist",
                success: false,
            });
        }
        //otp Generator
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })
        console.log("otp is ", otp);

        //save otp in db
        const existingOtp = await OTP.findOne({ email });
        if (existingOtp) {
            existingOtp.otp = otp;
            await existingOtp.save();
        }
        else {
            await OTP.create({
                email,
                otp,
            });
        }
        console.log("otp is :", otp);
        //success return
        res.status(200).json({
            success: true,
            message: "OTP successfully sent",
            otp: otp, // Return the OTP for testing purposes
        });
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: "Failed to send OTP",
            error: e.message,
        });
    }
}



//sign in with email and otp
exports.signin = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }
        // Check if user exists
        const user = await User.find({ email });
        if (user.length === 0) {
            return res.status(400).json({
                message: "User does not exist",
                success: false,
            });
        }
        // Validate OTP
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({
                message: "Invalid OTP",
                success: false,
            });
        }
        //generate a session token
        const Payload = {
            userId: user[0]._id,
            email: user[0].email,
            accountType: user[0].accountType, // Include account type in the payload
        };
        //using jwt to create a token
        let token = jwt.sign(Payload, process.env.JWT_SECRET, {
                    expiresIn: "7d" // Token expires in 7 days
                })
        // Save the token in the user's session or database as needed
        req.session.token = token; // Example of saving token in session
        // user.token = token;  
        // await user[0].save(); 

        
        // Here you can use a library like jsonwebtoken to create a token
        // const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });



        // Successful sign-in
        res.status(200).json({
            message: "Sign-in successful",
            success: true,
            user: user[0], // Return the user data
        });
    }

    catch (error) {
        console.error("Error in signin:", error.message);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
}


exports.logout = async (req, res) => {
    try {
        // Destroy the session to log out the user
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({   
                    message: "Failed to log out",
                    success: false,
                    error: err.message,
                });
            }
            res.status(200).json({
                message: "Logged out successfully",
                success: true,
            });
        }   
    );
    }       
    catch (error) {
        console.error("Error in logout:", error.message);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
}

exports.islogin = async (req, res) => {
    try {
    }
    catch (error) {
        console.error("Error in islogin:", error.message);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }

}