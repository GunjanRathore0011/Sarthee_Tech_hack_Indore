const cloudinary = require("cloudinary").v2;

async function UploadToCloudinary(file, folder , quality) {
    try {
        console.log("file uploading");
        const options = { folder };
        if(quality){
            options.quality = quality;
        }
        options.resource_type = "auto";
        return await cloudinary.uploader.upload(file.tempFilePath, options);
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error; // Rethrow for better error handling
    }
}

module.exports = UploadToCloudinary;