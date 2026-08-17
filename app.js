require("dotenv").config();
const express = require("express");
const userRoute = require("./routes/userRoutes/index");
const adminRoute = require("./routes/adminRoutes/index");

const connectDB = require("./config/db");
const configApp = require("./config/app-config");

const app = express();

const PORT = process.env.PORT || 3000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// en production : base de donnee distante (MONGO_URL), sinon base locale
const URL_DB = IS_PRODUCTION
    ? process.env.MONGO_URL
    : (process.env.LOCAL_MONGO_URL || "mongodb://localhost:27017/portfolio");

if (IS_PRODUCTION && !URL_DB) {
    console.error("La variable d'environnement MONGO_URL est requise en mode production");
    process.exit(1);
}

// configuration de l'application 
configApp(app, express);

// utilisation des routes
app.use("/admin", adminRoute);
app.use(userRoute);

// gestion des routes introuvables
app.use((request, response) => {
    response.status(404).json({ message: "Route introuvable" });
});

// gestion globale des erreurs (dont les erreurs multer)
app.use((error, request, response, next) => {
    if (error && error.name === "MulterError") {
        return response.status(400).json({ message: "Erreur lors de l'envoi du fichier : " + error.message });
    }
    console.error("Erreur non geree : ", error);
    return response.status(500).json({ message: "Une erreur interne est survenue" });
});

// connexion a la base de donnee 
connectDB(URL_DB).catch((error) => {
    console.error("Impossible de se connecter a la base de donnees : ", error.message);
    process.exit(1);
});

app.listen(PORT, function(error){
    if(error) {
        console.error("Erreur lors du lancement du serveur : ", error);
        process.exit(1);
    }
    console.log("serveur demarrer avec succes sur le port ", PORT);
});

