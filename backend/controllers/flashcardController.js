const Flashcard = require("../models/flashcardModel");
const Deck = require("../models/deckModel");

const createFlashcard = async (req, res) => {
    const deckId = req.params.id;
    const {term, definition} = req.body;

    console.log(deckId);

    const newCard = await Flashcard.create({term, definition, deck: deckId});
    const savedCard = await newCard.save();

    await Deck.findByIdAndUpdate(req.params.id, {$push: {cards: savedCard._id}});
     
    res.status(201).json(savedCard);
};

const updateFlashcard = async (req, res) => {
    const card = await Flashcard.findById(req.params.id);

    if (!card) {
        res.status(404);
        throw("Card not found!");
    }

    const newCard = await Flashcard.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json(newCard);
}

const deleteFlashcard = async (req, res) => {
    const deleteCard = await Flashcard.findByIdAndDelete(req.params.id);
    await Deck.findByIdAndUpdate(req.params.id, {$pull: {cards: deleteCard._id}});

    res.status(201).send(`Deleted card with ID: ${req.params.id}`);
};

module.exports = {createFlashcard, updateFlashcard, deleteFlashcard};