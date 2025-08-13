// IMPORTS: express and flashcard controllers
const express = require("express");
const {createFlashcard, updateFlashcard, deleteFlashcard} = require("../controllers/flashcardController")
const validateToken = require("../middleware/authenticationMiddleware");

// CREATE ROUTER
const router = express.Router();

// ROUTES -- *** require user authentication/login
router.post("/", validateToken, createFlashcard);
router.put("/", validateToken, updateFlashcard);
router.delete("/", validateToken, deleteFlashcard);

// EXPORTS: router
module.exports = router;