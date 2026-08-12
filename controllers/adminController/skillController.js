const express = require("express");
const skillModel = require("../../models/skills");

/**
 * ---------------------------------------------------------------
 * Fonction permettant de recuperer une ou toutes les competences (Admin)
 *
 * GET: /admin/skills?id=<id_skill>  → une competence specifique
 * GET: /admin/skills                → toutes les competences
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

/**
 * ---------------------------------------------------------------
 * Fonction permettant de creer une competence
 *
 * POST: /admin/skills/create
 * @param { express.Request } request
 * @param { express.Response } response
 */
const createSkill = async function (request, response) {
    try {
        const { skill_name } = request.body;

        const mySkill = new skillModel({ skill_name });
        await mySkill.save();

        console.log("La competence a ete creee avec success : ", mySkill, "\n");

        return response.status(201).json({
            message: "La competence a ete creee avec success !",
            skill: mySkill,
        });
    } catch (error) {
        console.log("Une erreur est survenue lors de la creation de la competence : ", error, "\n");

        return response.status(500).json({
            message: "Une erreur est survenue lors de la creation de la competence",
            error: error.message,
        });
    }
};

/**
 * ---------------------------------------------------------------
 * Fonction permettant de mettre a jour une competence
 *
 * PUT: /admin/skills/update?id=<id_skill>
 * @param { express.Request } request
 * @param { express.Response } response
 */
const updateSkill = async function (request, response) {
    const { id } = request.query;

    if (!id) {
        return response.status(400).json({
            message: "L'identifiant de la competence est requis pour pouvoir la mettre a jour",
        });
    }

    try {
        const skillData = request.body;

        const existingSkill = await skillModel.findById(id);
        if (!existingSkill) {
            return response.status(404).json({ message: "Competence introuvable" });
        }

        const updatedSkill = await skillModel.findByIdAndUpdate(
            id,
            skillData,
            { new: true }
        );

        console.log("La competence a ete mise a jour avec success : ", updatedSkill, "\n");

        return response.json({
            message: "La competence a ete mise a jour avec success !",
            skill: updatedSkill,
        });
    } catch (error) {
        console.log("Une erreur est survenue lors de la mise a jour de la competence : ", error, "\n");

        return response.status(500).json({
            message: "Une erreur est survenue lors de la mise a jour de la competence",
            error: error.message,
        });
    }
};

/**
 * ---------------------------------------------------------------
 * Fonction permettant de supprimer une competence
 *
 * DELETE: /admin/skills/delete?id=<id_skill>
 * @param { express.Request } request
 * @param { express.Response } response
 */
const deleteSkill = async function (request, response) {
    const { id } = request.query;

    if (!id) {
        return response.status(400).json({
            message: "L'identifiant de la competence est requis pour pouvoir la supprimer",
        });
    }

    try {
        const existingSkill = await skillModel.findById(id);
        if (!existingSkill) {
            return response.status(404).json({ message: "Competence introuvable" });
        }

        await skillModel.findByIdAndDelete(id);

        console.log("La competence a ete supprimee avec success ! \n");

        return response.json({
            message: "La competence a ete supprimee avec success !",
        });
    } catch (error) {
        console.log("Une erreur est survenue lors de la suppression de la competence : ", error, "\n");

        return response.status(500).json({
            message: "Une erreur est survenue lors de la suppression de la competence",
            error: error.message,
        });
    }
};

module.exports = {
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill,
};
