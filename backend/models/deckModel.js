// IMPORT: mongoose
const mongoose = require("mongoose");

/**
 * Name: name of the deck (String, required)
 * Description: description of the deck (String)
 * Cards: array of ID's of the cards of the deck (ObjectId)
 * CreatedDate: date the deck was created, set to the local date and time (Date)
 * User: ID of the user that created the deck
 */
const deckSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    cards: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cards"
    },

    createdDate: {
        type: Date,
        default: Date.now
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

// EXPORTS: Deck mongoose model
module.exports = mongoose.model("Deck", deckSchema);