const mongoose = require("mongoose");

const connectDB = async function(url) {
    try {
        await mongoose.connect(url);
        console.log("connexion a la base de donnee reussie");
    } catch (error) {
        console.log("erreur de connexion a la base de donnee ", error);
        throw error;
    }
};

module.exports = connectDB;
