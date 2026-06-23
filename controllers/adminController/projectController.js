const express = require("express");
const projectModel = require("../../models/projects");
const users = require("../../models/users");
const fs = require("fs");
const path = require("path");


/**
 * Fonction permettant de recuperer un project de la base de donnee 
 * si l'identifiant du projet est specifier on recupere le project en question 
 * @param { express.Request } request 
 * @param { express.Response } response 
 */
const getProject = async function(request, response){
    const {id} = request.query;

    try{
        if(id) {   
            const myProject = await projectModel.findById(id);
            console.log("Le projects a ete recuperer avec success : ", myProject);
            return response.json({
                message: "Le projet a ete recuperer avec success !",
                project: myProject
            });

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

const updateProject = async function(request, response){
    const {id} = request.query;
    const projectData = request.body;

    if(id) {
        try {
        // si un fichier a ete ajouter on le stocke dans le dossier uploads de public et sinon on garde l'ancien fichier
            if(request.file) {
                const existingProject = await projectModel.findById(id);

                if (existingProject?.project_cover_image) {
                    const oldImagePath = path.join(
                        __dirname, "..", "..", "public", existingProject.project_cover_image
                    );
                    try {
                        await fs.promises.unlink(oldImagePath);
                    } catch (error) {
                        if (error.code !== "ENOENT") throw error;
                    }
                }
                projectData.project_cover_image = "uploads/" + request.file.filename;
            } else {
                delete projectData.project_cover_image;
            }
            console.log("projectData : ", projectData);

            const myProject = await projectModel.findByIdAndUpdate(id, projectData, {new: true});
            return response.json({
                message: "Le project a ete mis a jour avec success !",
                project: myProject
            });
        }
        catch(error) {
            console.log("une erreur est survenue lors de la mise a jour du project : ", error)
            return response.status(500).json({
                message: `Une erreur est survenue lors de la mise a jour du project`,
                error: error,
            })
        }
    } else {
        return response.status(400).json({message: "L'identifiant du project est requis pour pouvoir le mettre a jour "});
    }
};


/**
 * Fonction pour Supprimer un project
 * @param {express.Request} request
 * @param {express.Response} response
 */

const deleteProject = async function(request, response) {
    const { id } = request.query;

    if (!id) {
        return response.status(400).json({
            message: "L'identifiant du project est requis pour pouvoir le supprimer ",
        });
    }

    try {
        const myProject = await projectModel.findById(id);
        if (!myProject) {
            return response.status(404).json({ message: "Projet introuvable" });
        }

        if (myProject.project_cover_image) {
            const imagePath = path.join(
                __dirname, "..", "..", "public", myProject.project_cover_image
            );
            try {
                await fs.promises.unlink(imagePath);
            } catch (error) {
                if (error.code !== "ENOENT") throw error;
            }
        }

        await projectModel.findByIdAndDelete(id);

        return response.json({
            message: "Le projet a ete supprime avec success !",
        });
    } catch (error) {
        console.log("une erreur est survenue lors de la suppression du projet : ", error);
        return response.status(500).json({
            message: "Une erreur est survenue lors de la suppression du projet",
            error: error,
        });
    }
};


/**
 * Fonction pour Cree un project
 * @param {express.Request} request
 * @param {express.Response} response
 */
const createProject = async function(request, response) {
    try{
        const myProject = new projectModel({...request.body, project_cover_image: "uploads/" + request.file.filename});
        await myProject.save();
        console.log("Le project a ete cree avec success avec le titre : ", myProject);
        return response.json({message: "Le project a ete cree avec success !", project: myProject});
    }
    catch(error) {
        console.log("une erreur est survenue lors de la creation du project : ", error)
        return response.status(500).json({message: `Une erreur est survenue lors de la creation du project`, error: error});
    }
};

module.exports = { 
    getProject,
    updateProject,
    deleteProject,
    createProject,
}