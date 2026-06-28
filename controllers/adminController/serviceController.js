const serviceModel = require("../../models/services");
const express = require("express");

/**
 * Fonction permettant de recuperer des services en base de donnee
 * 
 * GET : /admin/services => recupere tous les services 
 * 
 * GET : /admin/services?id=<id_services> => recupere un service precis 
 *  
 * @param { express.Request } request 
 * @param { express.Response } response 
 */
const getServices = async function(request, response){
    
    try{
        if(request.query.id) {
            const service = await serviceModel.findById(request.query.id);
            const message = "Le service a ete recuperer avec success !";

            console.log(message + " : " + service);
            return response.json({
                message,
                service
            });
        } 

        const services = await serviceModel.find({});
        console.log("les services ont ete recuperer avec success ! : ", services);
        return response.json({
            message: "les services ont ete recuperer avec success !",
            services,
        });

    } catch(error) {
        const message = "une Erreur serveur est survenue lors de la recuperation des services";
        console.log(message + " " + error);
        return response.status(500).json({
            message: message,
            error: error.message
        });
    }

};


/**
 * Fonction permettant de cree un service
 * 
 * POST : /admin/services/create 
 * @param { express.Request } request 
 * @param { express.Response } response 
 */
const createServices = async function(request, response){
    const serviceData = request.body;
    try {
        const service = new serviceModel({
            ...serviceData,
            service_skills: JSON.parse(serviceData.service_skills)
        });
        await service.save();
        console.log("le service a ete creer avec succes ! : ", service);
        
        return response.json({
            message: "Le service a ete creer avec succes !",
            service
        })
    } catch(error) {
        console.log("Une erreur est survenue lors de la creation d'un service : ", error);

        return response.status(500).json({
            message: "Une erreur est survenue lors de la creation d'un service",
            error: error.message
        });
    }
};


/**
 * Fonction pour supprimer un service existant 
 * 
 * DELETE : /admin/service/delete?id=<id_service>
 * @param { express.Request } request 
 * @param { express.Response } response 
 */
const deleteServices = async function(request, response){
    
    const {id} = request.query;
    if (id){

        try {
            await serviceModel.findByIdAndDelete(request.query.id);
            console.log("le service a ete supprimer avec success !");
            return response.json({
                message: "Le service a ete supprimer avec success !",
            });
    
        } catch(error) {
            console.log("Une erreur est survenue lors de la suppression d'un service : ", error);
    
            return response.status(500).json({
                message: "Une erreur est survenue lors de la suppression d'un service",
                error: error.message
            });
        }
    } 

    return response.status(400).json({
        message: "L'identifiant est obligatoire pour supprimer un article ",
    })
};

/**
 * Fonction pour mettre a jour un service 
 * 
 * PUT : /admin/services/update?id=<id_service>
 * @param { express.Request } request 
 * @param { express.Response } response 
 */

const updateServices = async function(request, response){
    const {id} = request.query;
    if(id) {

        try{
            const serviceData = request.body;

            const newService = await serviceModel.findByIdAndUpdate(id, {
                ...serviceData,
                service_skills: JSON.parse(serviceData.service_skills),
            }, {new: true});

            return response.json({
                message: "Le service a ete mise a jour avec success ",
                service: newService,
            })
            
        } catch(error){
            console.log("Une erreur est survenue lors de la mise a jour d'un service : ", error);
    
            return response.status(500).json({
                message: "Une erreur est survenue lors de la mise a jour d'un service",
                error: error.message
            });
        }
    } 
    return response.status(400).json({
        message: "L'identifiant du service est requis pour effectuer une modification "
    })
};


module.exports = {
    getServices,
    createServices,
    deleteServices,
    updateServices,
}