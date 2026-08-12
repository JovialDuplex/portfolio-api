const express = require("express");
const skillModel = require("../../models/skills");

/**
 * ---------------------------------------------------------------
 * Fonction permettant de recuperer une ou toutes les competences pour le public
 *
 * GET: /skills?id=<id_skill>  → une competence specifique
 * GET: /skills                → toutes les competences
 * @param { express.Request } request
 * @param { express.Response } response
 */
const getSkills = async function (request, response) {
    const { id } = request.query;

    try {
        if (id) {
            const skill = await skillModel.findById(id);

            if (!skill) {
                return response.status(404).json({ message: "Competence introuvable" });
            }

            console.log("La competence a ete recuperee avec success : ", skill, "\n");

            return response.json({
                message: "La competence a ete recuperee avec success !",
                skill,
            });
        }

        const skills = await skillModel.find({});

        console.log("La liste des competences a ete recuperee avec success : ", skills, "\n");

        return response.json({
            message: "La liste des competences a ete recuperee avec success !",
            skills,
        });

    } catch (error) {
        console.log("Une erreur est survenue lors de la recuperation des competences : ", error, "\n");

        return response.status(500).json({
            message: "Une erreur est survenue lors de la recuperation des competences",
            error: error.message,
        });
    }
};

module.exports = { getSkills };
