const router = require("express").Router()
const userController = require("../../controllers/userController");
const upload = require("../../config/multer-config");
const projectRoutes = require("./projectRoutes");
const serviceRoutes = require("./serviceRoutes");
const categoryRoutes = require("./categoryRoutes");
const skillRoutes = require("./skillRoutes");


router.use("/services", serviceRoutes);
router.use("/projects", projectRoutes);
router.use("/category", categoryRoutes);
router.use("/skills", skillRoutes);

router.get("/get-infos", userController.getUserInfos);
router.get("/", (request, response)=>{ console.log("welcome to my API"); return response.send("welcome to my API "); });
module.exports = router;