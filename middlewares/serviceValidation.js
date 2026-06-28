const joi = require("joi");
const express = require("express");

const addServiceValidationSchema = joi.object({
    service_name: joi.string().required().messages({
        "string.empty": "Le nom du service est obligatoire a sa creation",
    }),
    service_desc: joi.string().required().messages({
        "string.empty": "La description du service est requise a sa creation "
    }),
    service_icon: joi.string().required().messages({
        "string.empty": "L'icone du service est requise a sa creation "
    }),
    service_skills: joi.array().required(),
    
});


/**
 * Fonction de validation des donnee lors de l'ajout d'un service
 * @param { express.Request } request 
 * @param { express.Response } response 
 * @param { express.NextFunction } next 
 */
const addServiceValidation = function(request, response, next){
    const serviceData = request.body;
    if(serviceData) {
        const {error} = addServiceValidationSchema.validate({...serviceData, service_skills:JSON.parse(serviceData.service_skills)}, {abortEarly: false});
        if(error) {
            const details = error.details.map((detail)=>({
                message: detail.message,
                path: detail.path
            }));
            return response.status(400).json({
                message: "erreur lors de la validation des donnees d'ajout de fichier ",
                details: details
            })
        }
        console.log("La validation des donnees service a reussit avec succes !");
        return next()
    }

    return response.status(404).json({
        message: "aucune donnee n'a ete envoyer lors de la requete "
    })
}

module.exports = {
    addServiceValidation
}