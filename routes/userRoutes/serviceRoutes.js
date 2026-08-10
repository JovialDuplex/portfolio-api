const router = require("express").Router();
const serviceController = require("../../controllers/adminController/serviceController");
router.get("/", serviceController.getServices);

module.exports = router