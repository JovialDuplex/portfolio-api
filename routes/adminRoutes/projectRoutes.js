const router = require("express").Router();
const projectController = require("../../controllers/adminController/projectController");
const authMiddleware = require("../../middlewares/auth");
const upload = require("../../config/multer-config");
const projectValidation = require("../../middlewares/projectValidation");

router.get("/", authMiddleware, projectController.getProject);
router.post("/add", upload.single("project_cover_image"), authMiddleware, projectValidation.addProjectValidation, projectController.createProject);
router.put("/update", upload.single("project_cover_image"), authMiddleware, projectValidation.updateProjectValidation, projectController.updateProject);
router.delete("/delete", authMiddleware, projectController.deleteProject);

module.exports = router;
