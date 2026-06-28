
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../../models/users");
const fs = require("fs");
const path = require("path");


/**---------------------------------------------------------------
 * ------------ Fonction pour connecter l'administrateur a sa page d'accueil -------------------
 * POST : /admin/myself/login
 * @param {express.Request} request
 * @param {express.Response} response
 */
   
const login = async function(request, response){
    const {user_account_name, user_account_password} = request.body;
    // recuperer l'utilisateur 
    try {
        const adminUser = await userModel.findOne({user_account_name});
        if(!adminUser) {
            return response.status(401).json({message: "Une erreur est survenue lors de la connexion de l'admin "});
        }
        
        
        // comparaison du mot de passe 
        if(await adminUser.comparePassword(user_account_password)){
            // creation du token 
            const token = jwt.sign({id: adminUser._id}, process.env.TOKEN_KEY, {expiresIn: "7d"});

            console.log("connexion de l'administrateur reuissit avec succes !\n");
            
            return response.json({
                message: "connexion reuissit avec succes",
                token, 
                user: adminUser,
            });
        }
        return response.status(401).json({
            message : "connexion echouee: Le nom de l'utilisateur ou le mot de passe est incorrect ",
        })

    } catch(error) {
        console.log("Une erreur serveur est survenue lors de l'authentification de l'admin : ", error , "\n");

        response.status(500).json({message:"Une erreur serveur est survenue lors de l'authentification de l'admin", error: error.message });
        throw "une Erreur est survenu cote serveur", error;
        
    }
};


/**---------------------------------------------------------------
 * POST : /admin/myself/register 
 * Cette fonction permet de cree un administrateur et a noter que cette route ne s'ouvre qu'une seule fois 
 * @param { express.Request } request
 * @param { express.Response } response
 */
const register = async function(request, response){
    // verification s'il n'existe pas deja un admin en base 
    const existingAdminCount = await userModel.countDocuments();
    const message = "il existe deja un administrateur en base de donnee. Donc cette route vous ete interdite";

    if (existingAdminCount > 0) {
        return response.status(409).json({message: message});
    }

    const userData = request.body;
    
    try {
        const myAdmin = new userModel({ 
            ...userData, 
            user_socialNetworks: JSON.parse(userData.user_socialNetworks), 
            user_picture: "uploads/"+request.file.filename,
            user_skills: JSON.parse(userData.user_skills),
        });
        
        await myAdmin.save();
        
        console.log("l'administrateur a ete cree avec success ! :", myAdmin, "\n");

        return response.json({
            message: "l'administrateur a ete cree avec success !",
            admin: myAdmin
        });

    } catch(error){
        console.log("une erreur est survenue lors du premier enregistrement de l'administrateur : ", error, "\n");

        response.status(500).json({
            message: "une erreur est survenue lors du premier enregistrement de l'administrateur",
            error: error.message,
        })
    }
};

/** 
 * ---------------------------------------------------------------
 * Fonction permettant de mettre a jour les informations de l'utilisateur 
 * 
 * PUT: /admin/myself/update
 * @param { express.Request } request 
 * @param { express.Response } response 
 *  
 */
const updateUser = async function(request, response){
    const userData = request.body;
    try{
        const existingUser = await userModel.findOne({});

        if(request.file) {
            // supprimer l'ancien fichier si un nouveau a ete envoye 
            if(existingUser.user_picture) {
                const oldImagePath = path.join(__dirname, "..", "..", "public", existingUser.user_picture);
                try {
                    await fs.promises.unlink(oldImagePath);
                } catch (error) {
                    if (error.code !== "ENOENT") throw error;
                }

            }
        }

        const newUser = await userModel.findOneAndUpdate({}, {
            ...userData,
            user_picture: request.file ? `uploads/${request.file.filename}` : existingUser.user_picture,
            user_skills: userData.user_skills ? JSON.parse(userData.user_skills) : existingUser.user_skills,
            user_socialNetworks : userData.user_socialNetworks ? JSON.parse(userData.user_socialNetworks) : existingUser.user_socialNetworks,
            user_account_password: userData.user_account_password ? await bcrypt.hash(userData.user_account_password, await bcrypt.genSalt(10)) : existingUser.user_account_password,

        }, {new: true});

        console.log("L'utilisateur a ete mis a jour avec success ! : ", newUser, "\n");
        
        return response.json({

            message: "L'utilisateur a ete mis a jour avec success !",
            user: newUser,
        })
    } catch(error){
        response.status(500).json({
            message: "une erreur est survenue lors de la mise a jour des infos de l'utilisateur ",
            error: error.message
        });

        throw "Une erreur est survenue lors de la mise a jour des infos de l'utilisateur ! : ", error;

    }
}

/** 
 * ---------------------------------------------------------------
 * Fonction permettant de recuperer es informations de l'utilisateur 
 * 
 * PUT: /admin/myself/get-infos
 * @param { express.Request } request 
 * @param { express.Response } response 
 *  
 */
const getInfos = async function(request, response) {
    try{
        const user = await userModel.findOne({});
        console.log("les informations de l'utilisateur on ete recupere avec success :", user);
        return response.json({
            message: "Les informations de l'utilisateurs ont ete recuperer avec success !",
            user: user
        });

    } catch(error){
        return response.status(500).json({
            message: "Une erreur serveur est survenue lors de la recuperation des infos sur l'utilisateur !",
            error: error.message,
        });
    }

};

module.exports = {
    login,
    register,
    updateUser,
    getInfos,
}