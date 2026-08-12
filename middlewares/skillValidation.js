const joi = require("joi");
const express = require("express");

const createSkillSchema = joi.object({
    skill_name: joi.string().required().messages({
        "string.empty": "Le nom de la compétence est obligatoire à sa création",
        "any.required": "Le nom de la compétence est requis à sa création"
    }),
});

const updateSkillSchema = joi.object({
    skill_name: joi.string().optional().messages({
        "string.empty": "Le nom de la compétence ne peut pas être vide"
    }),
});

/**
 * Middleware de validation pour la création d'une compétence
 * @param { express.Request } request 
 * @param { express.Response } response 
 * @param { express.NextFunction } next 
 */
const createSkillValidation = function(request, response, next) {
    const skillData = request.body;
    if (!skillData || Object.keys(skillData).length === 0) {
        return response.status(400).json({
            message: "Aucune donnée n'a été envoyée lors de la requête"
        });
    }

    const { error } = createSkillSchema.validate(skillData, { abortEarly: false });
    if (error) {
        const details = error.details.map((detail) => ({
            message: detail.message,
            path: detail.path
        }));
        return response.status(400).json({
            message: "Erreur lors de la validation des données de la compétence",
            details: details
        });
    }

    return next();
};

/**
 * Middleware de validation pour la modification d'une compétence
 * @param { express.Request } request 
 * @param { express.Response } response 
 * @param { express.NextFunction } next 
 */
const updateSkillValidation = function(request, response, next) {
    const skillData = request.body;
    if (!skillData || Object.keys(skillData).length === 0) {
        return response.status(400).json({
            message: "Les données de la compétence sont nécessaires pour effectuer la modification"
        });
    }

    const { error } = updateSkillSchema.validate(skillData, { abortEarly: false });
    if (error) {
        const details = error.details.map((detail) => ({
            message: detail.message,
            path: detail.path
        }));
        return response.status(400).json({
            message: "Erreur lors de la validation des données de modification de la compétence",
            details: details
        });
    }

    return next();
};

module.exports = {
    createSkillValidation,
    updateSkillValidation,
};
