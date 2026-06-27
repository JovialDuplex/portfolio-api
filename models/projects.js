const mongoose = require("mongoose");
const mongooseType = mongoose.Schema.Types;

const projectSchema = new mongoose.Schema({
    project_title : {
        type: mongooseType.String,
        maxlength: 32,
        required: true,
    },
    project_desc: {
        type: mongooseType.String,
        maxlength: 256,
        required: true,
    },

    project_content: {
        type: mongooseType.String,
        required: true,
    },

    project_cover_image: {
        type: mongooseType.String,
        required: true,
    },
    
    project_status:{
        type: mongooseType.String,
        enum: ["pending", "completed"],
        required: true,
        default: "pending"
    },
    project_github_url: {
        type: mongooseType.String,
        required: true,
    },
    project_url: {
        type: mongooseType.String,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Project", projectSchema);