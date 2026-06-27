const joi = require("joi");
const fs = require("fs");
const path = require("path");
const projectModel = require("../models/projects");


const projectCoverImageSchema = joi.object({
    size: joi.number().required().max(1024 * 1024 * 5).messages({
        "number.max": "L'image de couverture du project doit contenir au plus 5MB",
    }),
    mimeType: joi.string().required().valid("image/jpeg", "image/png", "image/jpg").messages({
        "any.allowOnly": "L'image de couverture des projets doit etre des fichier jpg, png, ou jpeg"
    }),
});

const removeUploadedFile = async function(filename) {
    const filePath = path.join(__dirname, "..", "public", "uploads", filename);
    try {
        await fs.promises.unlink(filePath);
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }
};

const addProjectValidationSchema = joi.object({
    project_title: joi.string().required().max(32).messages({
        "string.empty": "Le titre du project est requis",
        "string.max": "Le titre du project doit contenir au plus 32 caracteres",
    }),
    project_desc: joi.string().required().max(256).messages({
        "string.empty": "La description du project est requise",
        "string.max": "La description du project doit contenir au plus 256 caracteres",
    }),
    project_content: joi.string().required().messages({
        "string.empty": "Le contenu du project est requis",
    }),
    project_cover_image: projectCoverImageSchema.required().messages({
        "any.required": "Le champ project_cover_image est requis",
    }),
    project_status: joi.string().required().valid("pending", "completed").messages({
        "string.empty": "Le statut du project est requis",
        "any.only": "Le statut du project doit etre soit 'pending' soit 'completed'",
    }),
    project_github_url: joi.string().required().messages({
        "string.empty": "L'URL du projet sur GitHub est requise",
    }),
    project_url: joi.string().required().messages({
        "string.empty": "L'URL du projet est requise",
    }),
});

const updateProjectValidationSchema = joi.object({
    project_title: joi.string().max(32).messages({
        "string.max": "Le titre du project doit contenir au plus 32 caracteres",
    }),
    project_desc: joi.string().max(256).messages({
        "string.max": "La description du project doit contenir au plus 256 caracteres",
    }),
    project_content: joi.string().required().messages({
        "string.empty": "Le contenu du project est requis",
    }),
    project_cover_image: projectCoverImageSchema.optional(),
    project_status: joi.string().valid("pending", "completed").messages({
        "string.empty": "Le statut du project est requis",
        "any.only": "Le statut du project doit etre soit 'pending' soit 'completed'",
    }),
    project_github_url: joi.string().messages({
        "string.empty": "L'URL du projet sur GitHub est requise",
    }),
    project_url: joi.string().messages({
        "string.empty": "L'URL du projet est requise",
    }),
});

// fonction pour valider l'ajout des donnees d'un project
const addProjectValidation = async function(request, response, next){
    const {error} = addProjectValidationSchema.validate({...request.body, project_cover_image: request.file ? {
        size: request.file.size,
        mimeType: request.file.mimetype,
    } : null});

    if(error) {
        if(request.file) {
            try {
                await removeUploadedFile(request.file.filename);
            } catch (unlinkError) {
                console.log("erreur lors de la suppression du fichier : ", unlinkError);
                return response.status(500).json({message: "Erreur lors de la suppression du fichier"});
            }
        }
        const details = error.details.map((detail) => ({
            message: detail.message,
            path: detail.path,
        }));
        console.log("erreur de validation des donnees du project : ", details);
        return response.status(400).json({message: "Erreur de validation des donnees du project", details: details});
    }
    return next();
};

// fonction pour valider la mise a jour des donnees d'un project
const updateProjectValidation = async function(request, response, next){
    const { id } = request.query;

    if (!id) {
        return response.status(400).json({
            message: "L'identifiant du project est requis pour pouvoir le mettre a jour",
        });
    }

    try {
        const myProject = await projectModel.findById(id);
        if (!myProject) {
            return response.status(404).json({ message: "Projet introuvable" });
        }

        const body = request.body ?? {};

        // fusion : les champs envoyes remplacent ceux en base, sinon on garde l'existant
        const dataToValidate = {
            project_title: body.project_title ?? myProject.project_title,
            project_desc: body.project_desc ?? myProject.project_desc,
            project_content: body.project_content ?? myProject.project_content,
            project_status: body.project_status ?? myProject.project_status,
            project_github_url: body.project_github_url ?? myProject.project_github_url,
            project_url: body.project_url ?? myProject.project_url,
        };

        if (request.file) {
            dataToValidate.project_cover_image = {
                size: request.file.size,
                mimeType: request.file.mimetype,
            };
        }

        const { error } = updateProjectValidationSchema.validate(dataToValidate);

        if (error) {
            if (request.file) {
                try {
                    await removeUploadedFile(request.file.filename);
                } catch (unlinkError) {
                    console.log("erreur lors de la suppression du fichier : ", unlinkError);
                    return response.status(500).json({ message: "Erreur lors de la suppression du fichier" });
                }
            }
            const details = error.details.map((detail) => ({
                message: detail.message,
                path: detail.path,
            }));
            console.log("erreur de validation des donnees du project : ", details);
            return response.status(400).json({ message: "Erreur de validation des donnees du project", details });
        }

        return next();
    } catch (error) {
        console.log("une erreur est survenue lors de la validation du project : ", error);
        return response.status(500).json({
            message: "Une erreur est survenue lors de la validation du project",
            error,
        });
    }
};

module.exports = {
    addProjectValidation,
    updateProjectValidation,
};