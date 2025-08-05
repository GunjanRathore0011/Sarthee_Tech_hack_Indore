const cloudinary = require("cloudinary").v2;

async function UploadToCloudinary(filePath, folder, quality) {
    try {
        console.log("file uploading");
        const options = { folder };
        if (quality) {
            options.quality = quality;
        }
        options.resource_type = "auto";
        return await cloudinary.uploader.upload(filePath, options);
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
}


module.exports = UploadToCloudinary;