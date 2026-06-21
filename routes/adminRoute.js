const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

router.post("/login", adminController.login)
router.get("/get-infos", async(request, response, next)=> {
    const {token} = request.query;
    if(token) {
        const user = await jwt.verify(token, process.env.TOKEN_KEY);
        console.log(user);
    }

    return response.status(402).json({message: "User is not authenticated ", error: true})
}, userController.getUserInfo);


module.exports = router;