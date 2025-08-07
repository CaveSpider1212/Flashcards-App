// IMPORTS: express and flashcard controllers
const express = require("express");
const {createFlashcard, updateFlashcard, deleteFlashcard} = require("../controllers/flashcardController");

// CREATE ROUTER
const router = express.Router();

// ROUTES
router.post("/:id", createFlashcard);
router.put("/:id", updateFlashcard);
router.delete("/:id", deleteFlashcard);

// EXPORTS: router
module.exports = router;