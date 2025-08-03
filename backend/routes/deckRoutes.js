const express = require("express");
const {getDecks, getDeckById, createDeck, deleteDeck} = require("../controllers/deckController");

const router = express.Router();

router.get("/", getDecks);

router.get("/:deckId", getDeckById);

router.post("/", createDeck);

router.delete("/:deckId", deleteDeck);

module.exports = router;