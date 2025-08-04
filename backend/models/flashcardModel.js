const mongoose = require("mongoose");

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

module.exports = mongoose.model("Flashcard", flashcardSchema);