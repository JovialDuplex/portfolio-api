const router = require("express").Router();
const projectRoutes = require("./projectRoutes");
const serviceRoutes = require("./servicesRoutes");
const myRoutes = require("./myself");

router.use("/projects", projectRoutes);
router.use("/services", serviceRoutes);
router.use("/myself", myRoutes);

module.exports = router;
