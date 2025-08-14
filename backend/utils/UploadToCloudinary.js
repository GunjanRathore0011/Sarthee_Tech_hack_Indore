const cloudinary = require("cloudinary").v2;
const path = require("path");

async function UploadToCloudinary(file, folder, quality) {
    try {
        const options = { folder };
        if (quality) options.quality = quality;

        const mimeType = file.mimetype;
        
        const filePath = path.resolve(file.tempFilePath); // ✅ normalize path

        if (mimeType.startsWith("video") || mimeType.startsWith("audio")) {
            options.resource_type = "video";
            console.log("Uploading video/audio...");
            return await cloudinary.uploader.upload(filePath, options);
        } else if (mimeType.startsWith("image")) {
            options.resource_type = "image";
            console.log("Uploading image...");
            return await cloudinary.uploader.upload(filePath, options);
        } else {
            throw new Error("Unsupported file type");
        }

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
}

module.exports = UploadToCloudinary;
