const router = require("express").Router();
const categoryController = require("../../controllers/userController/categoryController");

// GET /category?id=<id_categorie>  → une categorie
// GET /category                    → toutes les categories
router.get("/", categoryController.getCategory);

module.exports = router;
