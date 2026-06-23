const cors = require("cors")
const path = require("path");

const configApp = function(app, express){
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname, "..", "public")));
    app.use(cors());
    app.use((request, response, next) => {
        console.log("url : ", request.url, "method: ", request.method, "at ", new Date().toISOString());
        next();
    });
};

module.exports = configApp