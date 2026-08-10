const express = require("express");
const categoryModel = require("../../models/category");


/**
 * ---------------------------------------------------------------
 * Fonction permettant de recuperer une ou toutes les categories
 *
 * GET: /category?id=<id_categorie>  → une categorie specifique
 * GET: /category                    → toutes les categories
 * @param { express.Request } request
 * @param { express.Response } response
 */
const getCategory = async function (request, response) {
    const { id } = request.query;

    try {
        if (id) {
            const myCategory = await categoryModel.findById(id);

            if (!myCategory) {
                return response.status(404).json({ message: "Categorie introuvable" });
            }

            console.log("La categorie a ete recuperee avec success : ", myCategory, "\n");

            return response.json({
                message: "La categorie a ete recuperee avec success !",
                category: myCategory,
            });
        }

        const myCategories = await categoryModel.find({});

        console.log("La liste des categories a ete recuperee avec success : ", myCategories, "\n");

        return response.json({
            message: "La liste des categories a ete recuperee avec success !",
            categories: myCategories,
        });

    } catch (error) {
        console.log("Une erreur est survenue lors de la recuperation des categories : ", error, "\n");

        return response.status(500).json({
            message: "Une erreur est survenue lors de la recuperation des categories",
            error: error.message,
        });
    }
};

module.exports = { getCategory };
