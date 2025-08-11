// IMPORT: mongoose
const mongoose = require("mongoose");

/**
 * Username: username for login (String, required)
 * Password: password for login (String, required)
 */
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

// EXPORTS: User mongoose model
module.exports = mongoose.model("User", userSchema);