const mongoose = require("mongoose");

const deckSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    cards: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cards"
    },

    createdDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Deck", deckSchema);