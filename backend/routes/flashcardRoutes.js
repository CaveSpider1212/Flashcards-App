// IMPORTS: express, flashcard controller, authentication/authorization middleware, Flashcard model
const express = require("express");
const {createFlashcard, updateFlashcard, deleteFlashcard} = require("../controllers/flashcardController")
const validateToken = require("../middleware/authenticationMiddleware");
const isOwner = require("../middleware/authorizationMiddleware");
const Card = require("../models/flashcardModel");
const Deck = require("../models/deckModel");

// CREATE ROUTER
const router = express.Router();

// ROUTES -- *** require user authentication/login
router.post("/:id", validateToken, createFlashcard);
router.put("/:id", validateToken, updateFlashcard);
router.delete("/:id", validateToken, deleteFlashcard);

// EXPORTS: router
module.exports = router;