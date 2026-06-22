const router = require("express").Router()
const userController = require("../../controllers/userController");

router.get("/get-infos", userController.getUserInfo);

module.exports = router;