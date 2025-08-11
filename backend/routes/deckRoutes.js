// IMPORTS: express and deck controllers
const express = require("express");
const {getDecks, getDeckById, createDeck, deleteDeck, updateDeck} = require("../controllers/deckController");

// CREATE ROUTER
const router = express.Router();

// ROUTES
router.get("/", getDecks);
router.get("/:id", getDeckById);
router.put("/:id", updateDeck);
router.post("/:id", createDeck);
router.delete("/:id", deleteDeck);

// EXPORTS: router
module.exports = router;