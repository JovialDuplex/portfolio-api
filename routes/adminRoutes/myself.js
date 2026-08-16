const router = require("express").Router();
const upload = require("../../config/multer-config");
const adminController = require("../../controllers/adminController/adminController");
const authMiddleware = require("../../middlewares/auth");
const userValidation = require("../../middlewares/userValidation");

router.put("/update", upload.single("user_picture"), authMiddleware, userValidation.updateUserValidation, adminController.updateUser);
router.post("/login", userValidation.loginValidation, adminController.login);
router.post("/register", upload.single("user_picture"), adminController.register);
router.get("/get-infos", authMiddleware, adminController.getInfos);
router.post("/verify-password", authMiddleware, adminController.verifyPassword);

module.exports = router;
