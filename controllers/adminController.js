
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/users");

/**
 * ------------ Fonction pour connecter l'administrateur a sa page d'accueil -------------------
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
        if(await bcrypt.compare(user_account_password, adminUser.user_account_password)){
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
            message : "connexion echouee ",
        })

    } catch(error) {
        response.status(500).json({message:"Une erreur est serveur est survenue lors de la connexion de l'admin", error: error });
        throw "une Erreur est survenu cote serveur", error;
        
    }
};

module.exports = {
    login
}