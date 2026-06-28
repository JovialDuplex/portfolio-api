const express = require("express");
const joi = require("joi");

//schema de validation pour la mise a jour 
const userDataUpdateSchema = joi.object({
    user_name: joi.string().optional(),
    user_secondName: joi.string().optional(),
    user_jobName: joi.string().optional(),
    user_desc: joi.string().optional(),
    user_picture: joi.object({
        size: joi.number().max(5* 1024* 1024).required().messages({
            "number.max" : "La taille du fichier ne doit pas depasser 5Mo"
        }),
        mimetype: joi.string().valid("image/jpeg", "image/png", "image/jpg").required().messages({
            "any.allowOnly": "L'image de couverture de l'utilisateur doit etre un fichier .png, .jpg ou .jpeg",
        })

    }).optional(),

    user_socialNetworks: joi.array().optional(),
    user_skills: joi.array().optional(),
});

// schema de validation pour l'authentification
const loginDataShema = joi.object({
    user_account_name: joi.string().required().messages({
        "string.empty": "Le nom d'utilisateur du compte est requis "
    }),
    user_account_password: joi.string().required().messages({
        "string.empty": "Le mot de passe du compte est obligatoire",
    }),
});

/**
 * @description Fonction permettant de valider les informations d'authentification de l'utilisateur 
 * @param { express.Request } request 
 * @param { express.Response } response 
 * @param { express.NextFunction } next 
 */

const loginValidation = function(request, response, next) {
    console.log("\n validation des infos de l'utilisateur... ");
    const {user_account_name, user_account_password} = request.body;
    if(!user_account_name && !user_account_password) {
        return response.status(400).json({
            message: "Veuillez entrer le nom d'utilisateur du compte et le mot passe",
        })
    }
    const {error} = loginDataShema.validate({user_account_name, user_account_password}, {abortEarly: false});
    if(error) {
        const details = error.details.map(detail => ({
            message: detail.message,
            path: detail.path
        }));

        console.log("Des erreurs sont survenue lors de la validation des donnees d'authentification de l'utilisateur : ", details);
        return response.status(400).json({
            message: "Des erreurs sont survenue lors de la validation des donnees entree par l'utilisateur",
            details: details,
        })
    }

    console.log("la validation de l'authentification de l'admin a reussit avec success ! \n");
    return next();
}

/**
 * @description Fonction permettant de valider les informations de mise a jour de l'utilisateur 
 * @param { express.Request } request 
 * @param { express.Response } response 
 * @param { express.NextFunction } next 
 */

const updateUserValidation = function(request, response, next){
    console.log("validation des infos de l'utilisateur en cours ....");
    
    const userData = request.body;
    if(!userData) {
        return response.status(400).json({
            message: "Les donnee de l'utilisateur sont necessaire pour faire valider le formulaire",
        });
    }
    const {error} = userDataUpdateSchema.validate({
        ...userData, 
        user_picture: request.file && {
            size: request.file.size,
            mimetype: request.file.mimetype,
        }, 
        user_socialNetworks: userData.user_socialNetworks && JSON.parse(userData.user_socialNetworks),
        user_skills: userData.user_skills && JSON.parse(userData.user_skills)

    }, {abortEarly: false});

    if(error) {
        const details = error.details.map(detail => ({
            message: detail.message,
            path: detail.path
        }));

        console.log("Des erreurs sont survenue lors de la validation des donnees de mise a jour de l'utilisateur : ", details);
        return response.status(400).json({
            message: "Des erreurs sont survenue lors de la validation des donnees de mise a jour de l'utilisateur",
            details: details,
        })
    }

    return next();
};

module.exports = {
    updateUserValidation,
    loginValidation,
}