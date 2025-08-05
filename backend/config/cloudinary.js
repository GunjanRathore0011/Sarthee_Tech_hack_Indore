const cloudinary = require('cloudinary').v2;
require("dotenv").config();


// Configure Cloudinary with your credentials
const connectCloudinary = async () => {
    try {
        await cloudinary.config({
            cloud_name: process.env.CLOUD_NAME, 
            api_key: process.env.API_KEY, 
            api_secret: process.env.API_SECRET, 
        });
        
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
module.exports = connectCloudinary;
