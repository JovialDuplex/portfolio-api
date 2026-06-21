const express = require("express");
const userModel = require("../models/users");

/**
 * 
 * @param {express.Request} request 
 * @param {express.Response} response 
 */

const getUserInfo = async function(request, response) {
    try{
        const {id} = request.query;
        const user = await userModel.findOne({_id: id});
        return response.json({
            "message": "Utilisateur recuperer avec success",
            user,
        });

    } catch(error){
        return response.status(500).json({message: "Une erreur est survenue lors de la recuperation de l'utilisateur"})
    }
};

module.exports = {
    getUserInfo,
}