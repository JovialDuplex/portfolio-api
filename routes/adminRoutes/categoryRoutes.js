const router = require("express").Router();
const categoryController = require("../../controllers/adminController/categoryController");
const authMiddleware = require("../../middlewares/auth");

// POST /admin/category/create
router.post("/create", authMiddleware, categoryController.createCategory);

// PUT /admin/category/update?id=<id_category>
router.put("/update", authMiddleware, categoryController.updateCategory);

// DELETE /admin/category/delete?id=<id_category>
router.delete("/delete", authMiddleware, categoryController.deleteCategory);

module.exports = router;
