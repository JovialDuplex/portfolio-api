const mongoose = require("mongoose");
const mongooseType = mongoose.Schema.Types;

const skillsSchema = mongoose.Schema({
    skill_name: {
        type: mongooseType.String,
        required: true,
        trim: true,
    },
});

module.exports = mongoose.model("Skill", skillsSchema);
