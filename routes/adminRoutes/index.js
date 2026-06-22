const router = require("express").Router();
const projectRoutes = require("./projectRoutes");
const serviceRoutes = require("./servicesRoutes");
const adminController = require("../../controllers/adminController/adminController");

router.use("/projects", projectRoutes);
router.use("/services", serviceRoutes);
router.post("/login", adminController.login);

module.exports = router;
