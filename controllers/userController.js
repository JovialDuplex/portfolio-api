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
            const users = await userModel.find({}).select("-user_account_password -user_account_name");
            return response.json({
                message: "Utilisateurs recuperer avec success",
                users
            })
            // return response.status(400).json({
            //     message: "l'identifiant de l'utilisateur est requis pour pouvoir recuperer ces donnees "
            // });
        }
        const user = await userModel.findOne({_id: id}).select("-user_account_password -user_account_name");

        return response.json({
            "message": "Utilisateur recuperer avec success",
            user,
        });

    } catch(error){

        response.status(500).json({
            message: "Une erreur est survenue lors de la recuperation de l'utilisateur",
            error: error,
        });

        throw "une erreur est survenue lors de la recuperation de l'utilisateur : ",error;
    }
};



module.exports = {
    getUserInfos,
}