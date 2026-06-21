const { required } = require("joi");
const mongoose = require("mongoose");
const mongooseType = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    user_name: {
        type : mongooseType.String,
        required: true,
        maxlength: 16,
        trim: true,
    },
    user_secondName: {
        type: mongooseType.String,
        required: true,
        maxlength: 16,
        trim: true
    },
    user_account_name: {
        type: mongooseType.String,
        required: true,
        trim: true,
        maxlength: 32,
    },
    user_account_password : {
        type: mongooseType.String,
        required: true,
        minlength: 6
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
    }

});

module.exports = mongoose.model("User", userSchema);