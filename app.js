require("dotenv").config();
const express = require("express");
const userRoute = require("./routes/userRoutes/index");
const adminRoute = require("./routes/adminRoutes/index");

const connectDB = require("./config/db");
const configApp = require("./config/app-config");

const app = express();

const PORT = process.env.PORT || 3000;
const URL_DB = process.env.LOCAL_MONGO_URL;

// configuration de l'application 
configApp(app, express);

// utilisation des routes
app.use("/admin", adminRoute);
app.use(userRoute);

// connexion a la base de donnee 
connectDB(URL_DB);

app.listen(PORT, function(error){
    if(error) {throw "Une erreur c'est produite lors du lancement du serveur", error}
    console.log("serveur demarrer avec succes sur le port ", PORT);
});

