const router = require("express").Router();
const projectController = require("../../controllers/adminController/projectController");
const authMiddleware = require("../../middlewares/auth");
const { upload, handleImageUpload } = require("../../config/multer-config");
const projectValidation = require("../../middlewares/projectValidation");

router.get("/", authMiddleware, projectController.getProject);
router.post("/add", authMiddleware, upload.single("project_cover_image"), projectValidation.addProjectValidation, handleImageUpload("projects"), projectController.createProject);
router.put("/update", authMiddleware, upload.single("project_cover_image"), projectValidation.updateProjectValidation, handleImageUpload("projects"), projectController.updateProject);
router.delete("/delete", authMiddleware, projectController.deleteProject);

module.exports = router;
