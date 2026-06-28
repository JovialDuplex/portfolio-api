const jwt = require("jsonwebtoken");
const express = require("express");

/**
 * 
 * @param { express.Request } request 
 * @param { express.Response } response 
 * @param { express.NextFunction } next 
 * @returns 
 */
const authMiddleware = async function(request, response, next){
    console.log("\nverfication de l'authentification");
    const {token} = request.headers;
    if(!token) {
        console.log("le token n'a pas ete trouve ou est invalide \n");

        return response.status(401).json({
            message: "L'utilisateur n'est pas permis d'acces a cette route "
        });
    }
    try{
        jwt.verify(token, process.env.TOKEN_KEY);
        console.log("Vous avez l'access a cette route \n");
        return next();

    } catch(error) {
        console.log("une erreur est survenue lors de la verification de votre token ", error, "\n");
        return response.status(401).json({
            message: "une erreur est survenue lors de la verification de votre token ",
            error: error.message,
        })
    }
};

module.exports = authMiddleware;