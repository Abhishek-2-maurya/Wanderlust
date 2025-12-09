const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        
        if (!localFilePath) return null;
        const result = await cloudinary.uploader.upload(localFilePath, {
            folder: "wanderluster",
            resource_type: "auto",
        });

        
        fs.unlink(localFilePath, (err) => {
            if (err) console.log("Temp file delete error:", err);
        });

        return result;

    } catch (err) {
        console.log(`❌ Cloudinary Upload Error: ${err}`);
        fs.unlink(localFilePath, () => {});
        return null;
    }
};

module.exports = uploadOnCloudinary;
