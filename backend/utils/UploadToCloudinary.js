const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");


async function UploadToCloudinary(file, folder, quality) {
    try {
        const options = { folder };
        if (quality) options.quality = quality;

        const mimeType = file.mimetype;
        const filePath = path.resolve(file.tempFilePath); // ✅ normalize path

        let result;

        if (mimeType.startsWith("video") || mimeType.startsWith("audio")) {
            options.resource_type = "video";
            console.log("Uploading video/audio...");
            result = await cloudinary.uploader.upload(filePath, options);

        } else if (mimeType.startsWith("image")) {
            options.resource_type = "image";
            console.log("Uploading image...");
            result = await cloudinary.uploader.upload(filePath, options);

        } else if (mimeType === "application/pdf") {
            // options.resource_type = "raw";  // ✅ upload as raw
            console.log("Uploading PDF...");
            
                // Upload to Cloudinary (unsigned raw preset)
                const result = await new Promise((resolve, reject) => {
                  cloudinary.uploader.unsigned_upload(
                    filePath,
                    "public_pdf", // unsigned preset name
                    {
                      folder: "evidence", // folder in Cloudinary
                      resource_type: "image", // treat PDF as an image for inline preview
                      public_id: `complaint_report_${Date.now()}`, // unique ID
                    }, // no resource_type here
                    (err, uploadResult) => {
                      fs.unlinkSync(filePath); // cleanup
                      if (err) reject(err);
                      else resolve(uploadResult);
                    }
                  );
                });
                console.log("PDF uploaded to Cloudinary:", result.secure_url);
        return result;

        } else {
            throw new Error("Unsupported file type: " + mimeType);
        }

        return result;

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
}

module.exports = UploadToCloudinary;
