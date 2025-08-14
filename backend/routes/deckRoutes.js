// IMPORTS: express, deck controller, authentication/authorization middleware, Deck model
const express = require("express");
const {getDecks, getDeckById, createDeck, deleteDeck, updateDeck} = require("../controllers/deckController");
const validateToken = require("../middleware/authentication");
const isOwner = require("../middleware/authorization");
const Deck = require("../models/deckModel");


// CREATE ROUTER
const router = express.Router();

// ROUTES -- *** require user authentication/login
router.get("/", validateToken, getDecks);
router.get("/:id", validateToken, getDeckById);
router.put("/:id", validateToken, isOwner(Deck), updateDeck); // verifies the logged-in user owns the deck being modified
router.post("/", validateToken, createDeck);
router.delete("/:id", validateToken, isOwner(Deck), deleteDeck); // verifies the logged-in user owns the deck being modified

// EXPORTS: router
module.exports = router;