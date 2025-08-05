const express = require("express");
const router = express.Router();

const {createFlashcard, updateFlashcard, deleteFlashcard} = require("../controllers/flashcardController");

router.post("/:id", createFlashcard);

router.put("/:id", updateFlashcard);

router.delete("/:id", deleteFlashcard);

module.exports = router;