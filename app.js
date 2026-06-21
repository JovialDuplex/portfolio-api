require("dotenv").config();
const express = require("express");
const vhost = require("vhost");
const adminRoute = require("./routes/adminRoute");
const connectDB = require("./config/db");
const configApp = require("./config/app-config");

const app = express();
const adminApp = express();

const PORT = process.env.PORT || 3000;
const URL_DB = process.env.LOCAL_MONGO_URL;

app.use(vhost("admin.localhost.local", adminApp));
configApp(app, express);
configApp(adminApp, express);

adminApp.use(adminRoute);
connectDB(URL_DB);

app.get("/", (request, response)=>{
    response.send("bonjour client");
});


app.listen(PORT, function(error){
    if(error) {throw "Une erreur c'est produite lors du lancement du serveur", error}
    console.log("serveur demarrer avec succes sur le port ", PORT);
});

