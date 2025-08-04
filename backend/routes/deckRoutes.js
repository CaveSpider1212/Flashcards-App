const express = require("express");
const {getDecks, getDeckById, createDeck, deleteDeck} = require("../controllers/deckController");

const router = express.Router();

router.get("/", getDecks);

router.get("/:id", getDeckById);

router.post("/", createDeck);

router.delete("/:id", deleteDeck);

module.exports = router;