// IMPORTS: express, deck controller, authentication/authorization middleware, Deck model
const express = require("express");
const {getDecks, getDeckById, createDeck, deleteDeck, updateDeck} = require("../controllers/deckController");
const validateToken = require("../middleware/authenticationMiddleware");
const isOwner = require("../middleware/authorizationMiddleware");
const Deck = require("../models/deckModel");


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