const router = require("express").Router()
const userController = require("../../controllers/userController");
const upload = require("../../config/multer-config");

router.get("/get-infos", userController.getUserInfos);

module.exports = router;