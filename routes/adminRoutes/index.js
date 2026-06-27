const router = require("express").Router();
const projectRoutes = require("./projectRoutes");
const serviceRoutes = require("./servicesRoutes");
const adminController = require("../../controllers/adminController/adminController");
const upload = require("../../config/multer-config");

router.use("/projects", projectRoutes);
router.use("/services", serviceRoutes);

router.put("/update", adminController.updateUser);
router.post("/login", adminController.login);
router.post("/register", upload.single("user_picture"), adminController.register);

module.exports = router;
