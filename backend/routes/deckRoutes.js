// IMPORTS: express, deck controller, user authentication
const express = require("express");
const {getDecks, getDeckById, createDeck, deleteDeck, updateDeck} = require("../controllers/deckController");
const validateToken = require("../middleware/authentication");

// CREATE ROUTER
const router = express.Router();

// ROUTES
router.get("/", getDecks);
router.get("/:id", getDeckById);
router.put("/:id", updateDeck);
router.post("/", validateToken, createDeck); // ** requires user authentication
router.delete("/:id", deleteDeck);

// EXPORTS: router
module.exports = router;