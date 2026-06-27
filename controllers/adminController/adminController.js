
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../../models/users");
const fs = require("fs");
const path = require("path");


/**---------------------------------------------------------------
 * ------------ Fonction pour connecter l'administrateur a sa page d'accueil -------------------
 * POST : /admin/login
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
        
        console.log(adminUser);
        
        // comparaison du mot de passe 
        if(await adminUser.comparePassword(user_account_password)){
            // creation du token 
            const token = jwt.sign({id: adminUser._id, role: "admin"}, process.env.TOKEN_KEY, {expiresIn: "7d", algorithm: "HS256"});
            console.log("connexion de l'administrateur reuissit avec succes");
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
        response.status(500).json({message:"Une erreur serveur est survenue lors de la connexion de l'admin", error: error.message });
        throw "une Erreur est survenu cote serveur", error;
        
    }
};


/**---------------------------------------------------------------
 * POST : /admin/register 
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
            user_picture: "uploads/"+request.file.filename 
        });
        
        await myAdmin.save();
        
        console.log("l'administrateur a ete cree avec success ! :", myAdmin);

        return response.json({
            message: "l'administrateur a ete cree avec success !",
            admin: myAdmin
        });

    } catch(error){
        console.log("une erreur est survenue lors du premier enregistrement de l'administrateur : ", error);

        response.status(500).json({
            message: "une erreur est survenue lors du premier enregistrement de l'administrateur",
            error: error.message,
        })
    }
};

/** 
 * ---------------------------------------------------------------
 * @description Fonction permettant de mettre a jour les informations de l'utilisateur 
 * @param { express.Request } request 
 * @param { express.Response } response 
 *  
 */
const updateUser = async function(request, response){
    const userData = request.body;
    try{
        if(request.file) {
            // si un nouveau fichier a ete envoye 
            const existingUser = await userModel.findOne({});
            if(existingUser.user_picture) {
                const oldImagePath = path.join(__dirname, "..", "..", "public", existingUser.user_picture);
                try {
                    await fs.promises.unlink(oldImagePath);
                } catch (error) {
                    if (error.code !== "ENOENT") throw error;
                }

            }
        } else {
            delete userData.user_picture;
        }

        const newUserData =  userModel.updateOne({...userData}, {new: true});
        return response.json({
            message: "L'utilisateur a ete mis a jour avec success ",
            newUserData,
        });

    } catch(error){
        response.status(500).json({
            message: "une erreur est survenue lors de la mise a jour des infos de l'utilisateur ",
            error: error
        });

        throw "Une erreur est survenue lors de la mise a jour des infos de l'utilisateur ! : ", error;

    }
}


module.exports = {
    login,
    register,
    updateUser,
}