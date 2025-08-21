// IMPORT: mongoose
const mongoose = require("mongoose");

/**
 * Username: username for login (String, required)
 * Password: password for login (String, required)
 * Decks: ID's of decks created by user (ObjectId)
 */
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    decks: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Decks"
    }
}, {timestamps: true});

// EXPORTS: User mongoose model
module.exports = mongoose.model("User", userSchema);