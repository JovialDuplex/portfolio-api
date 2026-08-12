const router = require("express").Router();
const skillController = require("../../controllers/userController/skillController");

// GET /skills?id=<id_skill>  → une competence
// GET /skills                → toutes les competences
router.get("/", skillController.getSkills);

module.exports = router;
