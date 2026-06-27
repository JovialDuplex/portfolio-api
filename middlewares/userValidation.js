const express = require("express");
const joi = require("joi");


const userDataUpdateSchema = joi.object({
    user_name: joi.string().optional(),
    user_secondName: joi.string().optional(),
    user_jobName: joi.string().optional(),
    user_desc: joi.string().optional(),
    user_picture: joi.object({
        size: joi.number().max(5* 1024* 1024).required().message({
            "number.max" : "La taille du fichier ne doit pas depasser 5Mo"
        }),
        mimetype: joi.string().valid("image/jpeg", "image/png", "image/jpg").required().messages({
            "any.allowOnly": "L'image de couverture de l'utilisateur doit etre un fichier .png, .jpg ou .jpeg",
        })

    }).optional(),

    user_socialNetworks: joi.object({
        social_name: joi.string().required(),
        social_url: joi.string().required(),
    }).optional(),
})

/**
 * @description Fonction permettant de valider les informations de mise a jour de l'utilisateur 
 * @param { express.Request } request 
 * @param { express.Response } response 
 * @param { express.NextFunction } next 
 */

const updateUserValidation = function(request, response, next){
    console.log("verification des infos de l'utilisateur en cours ");
    return next();
};

module.exports = {
    updateUserValidation
}