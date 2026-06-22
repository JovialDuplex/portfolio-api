const express = require("express");
const projectModel = require("../../models/projects");
const users = require("../../models/users");

/**
 * Fonction permettant de recuperer un project de la base de donnee 
 * si l'identifiant du projet est specifier on recupere le project en question 
 * @param { express.Request } request 
 * @param { express.Response } response 
 */
const getProject = async function(request, response){
    const {id} = request.params;
    try{
        if(id) {   
            const myProject = await projectModel.findById(id);
            return response.json({
                message: "Le projet a ete recuperer avec success !",
                project: myProject
            });

            console.log("Le projects a ete recuperer avec success : ", myProject);
        }

        const myProjects = await projectModel.find({});
        
        console.log("La liste des projects ont ete recuperer avec success: ", myProjects);

        return response.json({
            message: "La liste des projects ont ete recuperer avec success !",
            projects: myProjects,
        });

    } catch(error) {
        console.log("une erreur est survenue lors de la recuperation des projects : ", error)
        
        return response.status(500).json({
            message: `Une erreur est survenue lors de la recuperation des projects`,
            error: error,
        })
    }


};


/**
 * Fonction pour mettre a jour un project
 * @param {express.Request} request
 * @param {express.Response} response
 */

const updateProject = function(request, response){

    return response.send("updating project ...");
};


/**
 * Fonction pour Supprimer un project
 * @param {express.Request} request
 * @param {express.Response} response
 */
const deleteProject = function(request, response) {
    return response.send("deleting project ...");
};


/**
 * Fonction pour Cree un project
 * @param {express.Request} request
 * @param {express.Response} response
 */
const createProject = async function(request, response) {
    try {
        const projectData = request.body;
        response.send(projectData);
        // const myProject = new projectModel({...projectData});


    } catch(error) {
        console.log("une erreur est survenue lors de la creation du projects : ", error)
        
        return response.status(500).json({
            message: `Une erreur est survenue lors de la creation du projects`,
            error: error,
        })
    }
};


module.exports = { 
    getProject,
    updateProject,
    deleteProject,
    createProject,
}