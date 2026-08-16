const mongoose = require("mongoose");
const mongooseType = mongoose.Schema.Types;
const bcrypt = require("bcryptjs");
const { required } = require("joi");


const userSchema = new mongoose.Schema({
    user_name: {
        type: mongooseType.String,
        required: true,
        maxlength: 16,
        trim: true,
    },
    user_email: {
        type: mongooseType.String,
        required: true,
        unique: true,
        trim: true,
    },
    user_secondName: {
        type: mongooseType.String,
        required: true,
        maxlength: 16,
        trim: true
    },
    user_contact_phone: {
        type: mongooseType.String,
        required: true,
        trim: true,
    },
    user_whatsapp_phone: {
        type: mongooseType.String,
        required: true,
        trim: true,
    },

    user_account_name: {
        type: mongooseType.String,
        required: true,
        trim: true,
        maxlength: 16,
    },
    user_account_password: {
        type: mongooseType.String,
        required: true,
        minlength: 4,
    },
    user_jobName: {
        type: mongooseType.String,
        required: true,
        maxlength: 32,
        trim: true
    },
    user_desc: {
        type: mongooseType.String,
        required: true,
        maxlength: 256,
        trim: true
    },

    user_picture: {
        type: mongooseType.String,
        required: true,
    },
    user_skills: {
        type: [mongooseType.ObjectId],
        ref: "Skill",
        default: []
    },

    user_socialNetworks: [
        {
            social_name: {
                type: mongooseType.String,
                required: [true, "Le nom du reseaux social est requis "],
                trim: true
            },

            social_icon: {
                type: String,
                required: [true, "L'icon du reseaux social est requis"]
            },

            social_url: {
                type: mongooseType.String,
                required: [true, "L'url du reseaux social est requis "],
            }
        }
    ]

}, {
    timestamps: true
});

// Hacher le mot de passe s'il a été modifié ou à sa création
userSchema.pre("save", async function hashPassword() {
    if (!this.isModified("user_account_password")) return;
    try {
        this.user_account_password = await bcrypt.hash(this.user_account_password, await bcrypt.genSalt(10));
    } catch (error) {
        throw new Error("Erreur lors du hashage du mot de passe : " + error.message);
    }
});

/**
 * Fonction qui compare le mot de passe de l'utilisateur avec celui de la base
 * @param {string} myPassword 
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function comparePassword(myPassword) {
    console.log(this.user_account_password)
    return await bcrypt.compare(myPassword, this.user_account_password);

};

module.exports = mongoose.model("User", userSchema);