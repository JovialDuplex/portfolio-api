const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (process.env.NODE_ENV === "production" && (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET)) {
    console.warn("Attention : les credentials Cloudinary ne sont pas toutes definies dans le fichier .env (requis en production)");
}

/**
 * Upload d'un buffer (fichier reçu par multer) vers Cloudinary
 * @param {Buffer} buffer
 * @param {object} [options]
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
const uploadBuffer = function(buffer, options = {}) {
    return new Promise(function(resolve, reject) {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "jovial-portfolio", ...options },
            function(error, result) {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

/**
 * Suppression d'une image Cloudinary à partir de son URL stockee en base
 * @param {string} url
 * @returns {Promise<void>}
 */
const deleteImageByUrl = async function(url) {
    if (!url || typeof url !== "string") return;

    const token = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`;
    if (!url.startsWith(token)) return;

    const parts = url.slice(token.length).split("/");
    if (/^v\d+$/.test(parts[0])) parts.shift();

    const publicId = parts.join("/").replace(/\.[a-zA-Z0-9]+$/, "");
    if (!publicId) return;

    return cloudinary.uploader.destroy(publicId);
};

module.exports = {
    cloudinary,
    uploadBuffer,
    deleteImageByUrl,
};