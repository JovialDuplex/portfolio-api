const express = require("express");
const categoryModel = require("../../models/category");


/**
 * ---------------------------------------------------------------
 * Fonction permettant de creer une categorie
 *
 * POST: /admin/category/create
 * @param { express.Request } request
 * @param { express.Response } response
 */
const createCategory = async function (request, response) {
    try {
        const { category_name, category_icon } = request.body;

        const myCategory = new categoryModel({ category_name, category_icon });
        await myCategory.save();

        console.log("La categorie a ete creee avec success : ", myCategory, "\n");

        return response.status(201).json({
            message: "La categorie a ete creee avec success !",
            category: myCategory,
        });
    } catch (error) {
        console.log("Une erreur est survenue lors de la creation de la categorie : ", error, "\n");

        return response.status(500).json({
            message: "Une erreur est survenue lors de la creation de la categorie",
            error: error.message,
        });
    }
};


/**
 * ---------------------------------------------------------------
 * Fonction permettant de mettre a jour une categorie
 *
 * PUT: /admin/category/update?id=<id_category>
 * @param { express.Request } request
 * @param { express.Response } response
 */
const updateCategory = async function (request, response) {
    const { id } = request.query;

    if (!id) {
        return response.status(400).json({
            message: "L'identifiant de la categorie est requis pour pouvoir la mettre a jour",
        });
    }

    try {
        const categoryData = request.body;

        const existingCategory = await categoryModel.findById(id);
        if (!existingCategory) {
            return response.status(404).json({ message: "Categorie introuvable" });
        }

        const updatedCategory = await categoryModel.findByIdAndUpdate(
            id,
            categoryData,
            { new: true }
        );

        console.log("La categorie a ete mise a jour avec success : ", updatedCategory, "\n");

        return response.json({
            message: "La categorie a ete mise a jour avec success !",
            category: updatedCategory,
        });
    } catch (error) {
        console.log("Une erreur est survenue lors de la mise a jour de la categorie : ", error, "\n");

        return response.status(500).json({
            message: "Une erreur est survenue lors de la mise a jour de la categorie",
            error: error.message,
        });
    }
};


/**
 * ---------------------------------------------------------------
 * Fonction permettant de supprimer une categorie
 *
 * DELETE: /admin/category/delete?id=<id_category>
 * @param { express.Request } request
 * @param { express.Response } response
 */
const deleteCategory = async function (request, response) {
    const { id } = request.query;

    if (!id) {
        return response.status(400).json({
            message: "L'identifiant de la categorie est requis pour pouvoir la supprimer",
        });
    }

    try {
        const existingCategory = await categoryModel.findById(id);
        if (!existingCategory) {
            return response.status(404).json({ message: "Categorie introuvable" });
        }

        await categoryModel.findByIdAndDelete(id);

        console.log("La categorie a ete supprimee avec success ! \n");

        return response.json({
            message: "La categorie a ete supprimee avec success !",
        });
    } catch (error) {
        console.log("Une erreur est survenue lors de la suppression de la categorie : ", error, "\n");

        return response.status(500).json({
            message: "Une erreur est survenue lors de la suppression de la categorie",
            error: error.message,
        });
    }
};


module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
};
