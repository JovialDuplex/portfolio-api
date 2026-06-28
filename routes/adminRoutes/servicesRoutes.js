const router = require("express").Router();
const authMiddleware = require("../../middlewares/auth");
const serviceController = require("../../controllers/adminController/serviceController");
const serviceValidation = require("../../middlewares/serviceValidation");

router.get("/", authMiddleware, serviceController.getServices)
router.post("/create", authMiddleware, serviceValidation.addServiceValidation, serviceController.createServices);
router.delete("/delete", authMiddleware, serviceController.deleteServices);
router.put("/update", authMiddleware, serviceController.updateServices);

module.exports = router;
