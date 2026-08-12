const router = require("express").Router();
const skillController = require("../../controllers/adminController/skillController");
const authMiddleware = require("../../middlewares/auth");
const { createSkillValidation, updateSkillValidation } = require("../../middlewares/skillValidation");

// GET /admin/skills?id=<id_skill> ou /admin/skills
router.get("/", authMiddleware, skillController.getSkills);

// POST /admin/skills/create
router.post("/create", authMiddleware, createSkillValidation, skillController.createSkill);

// PUT /admin/skills/update?id=<id_skill>
router.put("/update", authMiddleware, updateSkillValidation, skillController.updateSkill);

// DELETE /admin/skills/delete?id=<id_skill>
router.delete("/delete", authMiddleware, skillController.deleteSkill);

module.exports = router;
