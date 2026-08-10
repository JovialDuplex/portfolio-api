const mongoose = require("mongoose");
const mongooseType = mongoose.Schema.Types;

const categorySchema = mongoose.Schema({
    category_name: {
        type: mongooseType.String,
        required: true,
        trim: true,
    },
    category_icon: {
        type: mongooseType.String,
        required: true,
    }
});

module.exports = mongoose.model("Category", categorySchema);