// IMPORTS: express, deck controller, user authentication
const express = require("express");
const {getDecks, createDeck, deleteDeck, updateDeck} = require("../controllers/deckController");
const validateToken = require("../middleware/authenticationMiddleware");

// CREATE ROUTER
const router = express.Router();

// ROUTES -- *** require user authentication/login
router.get("/", validateToken, getDecks);
router.put("/", validateToken, updateDeck);
router.post("/", validateToken, createDeck);
router.delete("/", validateToken, deleteDeck);

// EXPORTS: router
module.exports = router;