const router = require("express").Router();
const projectRoutes = require("./projectRoutes");
const serviceRoutes = require("./servicesRoutes");
const myRoutes = require("./myself");
const categoryRoutes = require("./categoryRoutes");
const skillRoutes = require("./skillRoutes");

router.use("/projects", projectRoutes);
router.use("/services", serviceRoutes);
router.use("/myself", myRoutes);
router.use("/category", categoryRoutes);
router.use("/skills", skillRoutes);

module.exports = router;
