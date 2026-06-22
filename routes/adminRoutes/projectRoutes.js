const router = require("express").Router();
const projectController = require("../../controllers/adminController/projectController");
const authMiddleware = require("../../middlewares/auth");
const upload = require("../../config/multer-config");

router.get("/:id", authMiddleware, projectController.getProject);
router.post("/add", upload.single("project_cover_image"), authMiddleware, projectController.createProject);
router.put("/update", authMiddleware, projectController.updateProject);
router.delete("/delete", authMiddleware, projectController.deleteProject);

module.exports = router;
