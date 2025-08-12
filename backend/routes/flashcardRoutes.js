// IMPORTS: express and flashcard controllers
const express = require("express");
const {createFlashcard, updateFlashcard, deleteFlashcard} = require("../controllers/flashcardController")
const validateToken = require("../middleware/authentication");

// CREATE ROUTER
const router = express.Router();

// ROUTES
router.post("/:id", validateToken, createFlashcard); // ** requires user authentication
router.put("/:id", updateFlashcard);
router.delete("/:id", validateToken, deleteFlashcard); // ** requires user authentication

// EXPORTS: router
module.exports = router;