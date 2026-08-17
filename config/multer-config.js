const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { uploadBuffer, deleteImageByUrl } = require("./cloudinary");

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// developement : stockage local dans public/uploads
// production : stockage en memoire puis upload vers Cloudinary
const storage = IS_PRODUCTION
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: function(request, file, callback){
            const uploadDir = path.join(__dirname, "..", "public", "uploads");
            fs.mkdirSync(uploadDir, { recursive: true });
            callback(null, uploadDir);
        },
        filename: function(request, file, callback) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random()* 1E9);
            callback(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
        }
    });

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

/**
 * Middleware positionnant request.file.url :
 * - en production : upload vers Cloudinary
 * - en developpement : chemin local "uploads/<nom-du-fichier>"
 * @param {string} [folder] sous-dossier Cloudinary (production uniquement)
 */
const handleImageUpload = function(folder = "uploads") {
    return async function(request, response, next) {
        if (!request.file) return next();

        try {
            if (IS_PRODUCTION) {
                const result = await uploadBuffer(request.file.buffer, { folder });
                request.file.url = result.secure_url;
            } else {
                request.file.url = "uploads/" + request.file.filename;
            }
            return next();
        } catch (error) {
            console.log("erreur lors de l'upload de l'image : ", error);
            return response.status(500).json({
                message: IS_PRODUCTION
                    ? "Une erreur est survenue lors de l'upload de l'image vers Cloudinary"
                    : "Une erreur est survenue lors de l'enregistrement de l'image",
                error: error.message,
            });
        }
    };
};

/**
 * Suppression d'une image :
 * - en production : suppression sur Cloudinary via son URL
 * - en developpement : suppression du fichier local
 * @param {string} url chemin/URL stocke en base
 */
const deleteImage = function(url) {
    if (IS_PRODUCTION) {
        return deleteImageByUrl(url);
    }

    if (!url || typeof url !== "string") return;
    const filePath = path.join(__dirname, "..", "public", url);
    return fs.promises.unlink(filePath).catch(function(error){
        if (error.code !== "ENOENT") throw error;
    });
};

/**
 * Nettoie un fichier local si la validation echoue (developpement uniquement)
 * @param {object} [file] request.file
 */
const cleanupOnError = async function(file) {
    if (IS_PRODUCTION || !file || !file.filename) return;
    const filePath = path.join(__dirname, "..", "public", "uploads", file.filename);
    try {
        await fs.promises.unlink(filePath);
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }
};

module.exports = {
    upload,
    handleImageUpload,
    deleteImage,
    cleanupOnError,
};