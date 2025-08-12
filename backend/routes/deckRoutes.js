// IMPORTS: express, deck controller, user authentication
const express = require("express");
const {getDecks, getDeckById, createDeck, deleteDeck, updateDeck} = require("../controllers/deckController");
const validateToken = require("../middleware/authentication");

// CREATE ROUTER
const router = express.Router();

// ROUTES -- *** require user authentication/login
router.get("/", validateToken, getDecks);
router.get("/:id", validateToken, getDeckById);
router.put("/:id", validateToken, updateDeck);
router.post("/", validateToken, createDeck);
router.delete("/:id", validateToken, deleteDeck);

// EXPORTS: router
module.exports = router;