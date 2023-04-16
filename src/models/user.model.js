const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: "username is required",
        },
        email: {
            type: String,
            required: "email is required",
        },
        phone: {
            type: Number,
            required: "phone number is required",
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
        },
        password: {
            type: String,
            required: "please enter strong password",
        },
        refreshToken: {
            type: String,
        },
        status: {
            type: String,
            enum: ["true", "false"],
            default: 'false'
        }
    },
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("User", UserSchema);
