const mongoose = require("mongoose");
const mongooseType = mongoose.Schema.Types;

const serviceSchema = new mongoose.Schema({
    service_name: {
        type: mongooseType.String,
        required: [true, "Le nom du service est requis !"],
        trim: true,
    },
    service_desc: {
        type: mongooseType.String,
        required: [true, "La description du service est requise "],
        trim: true,
    },
    service_icon: {
        type: mongooseType.String,
        required: [true, "le nom de l'icone du service est requis "],
        trim: true,
    },
    service_skills: {
        type: [mongooseType.String],
        default: [],
    }

}, {
    timestamps: true,
});

module.exports = mongoose.model("Service", serviceSchema);
