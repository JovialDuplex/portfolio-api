const authMiddleware = function(request, response, next){
    console.log("authentification verifying");
    return next();
};

module.exports = authMiddleware;