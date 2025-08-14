// IMPORTS: express, flashcard controller, authentication/authorization middleware, Flashcard model
const express = require("express");
const {createFlashcard, updateFlashcard, deleteFlashcard} = require("../controllers/flashcardController")
const validateToken = require("../middleware/authentication");
const isOwner = require("../middleware/authorization");
const Card = require("../models/flashcardModel");
const Deck = require("../models/deckModel");

// CREATE ROUTER
const router = express.Router();

// ROUTES -- *** require user authentication/login
router.post("/:id", validateToken, isOwner(Deck), createFlashcard); // verifies the logged-in user owns the deck being modified
router.put("/:id", validateToken, isOwner(Card), updateFlashcard); // verifies the logged-in user owns the card being modified
router.delete("/:id", validateToken, isOwner(Card), deleteFlashcard); // verifies the logged-in user owns the card being modified

// EXPORTS: router
module.exports = router;