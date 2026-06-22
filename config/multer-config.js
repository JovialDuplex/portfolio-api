const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function(request, file, callback){
        callback(null, path.join(__dirname, "..", "public", "uploads"));
    },
    filename: function(request, file, callback) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random()* 1E9);
        callback(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});

module.exports = multer({storage});
