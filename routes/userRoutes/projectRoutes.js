const projectController = require("../../controllers/adminController/projectController");

const router = require("express").Router();

router.get("/", projectController.getProject);

module.exports = router;