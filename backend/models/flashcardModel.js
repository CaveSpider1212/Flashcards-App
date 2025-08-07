// IMPORT: mongoose
const mongoose = require("mongoose");

/**
 * Term: flashcard's term (String, required)
 * Definition: flashcard's definition (String, required)
 * Deck: ID of the deck the card is part of (ObjectId)
 */
const flashcardSchema = mongoose.Schema({
    term: {
        type: String,
        required: true
    },

    definition: {
        type: String,
        required: true
    },

    deck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Decks"
    }
})

// EXPORTS: Flashcard mongoose model
module.exports = mongoose.model("Flashcard", flashcardSchema);