const express = require("express");
const userModel = require("../models/users");

/**
 * Fonction permettant de recuperer les infos de l'utilisateur
 * @param {express.Request} request 
 * @param {express.Response} response 
 */

const getUserInfos = async function(request, response) {
    try{
        const {id} = request.query;
        if(!id) {
            const users = await userModel.find({}).select("-user_account_password -user_account_name").populate("user_skills");
            return response.json({
                message: "Utilisateurs recuperer avec success",
                users
            })
        }
        const user = await userModel.findOne({_id: id}).select("-user_account_password -user_account_name").populate("user_skills");

        return response.json({
            "message": "Utilisateur recuperer avec success",
            user,
        });

    } catch(error){

        return response.status(500).json({
            message: "Une erreur est survenue lors de la recuperation de l'utilisateur",
            error: error.message,
        });
    }
};



module.exports = {
    getUserInfos,
}