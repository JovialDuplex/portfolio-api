const router = require("express").Router();
const projectRoutes = require("./projectRoutes");
const serviceRoutes = require("./servicesRoutes");
const myRoutes = require("./myself");
const categoryRoutes = require("./categoryRoutes");

router.use("/projects", projectRoutes);
router.use("/services", serviceRoutes);
router.use("/myself", myRoutes);
router.use("/category", categoryRoutes);

module.exports = router;
