const Flashcard = require("../models/flashcardModel");
const Deck = require("../models/deckModel");

const createFlashcard = async (req, res) => {
    const {term, definition} = req.body;

    const newCard = await Flashcard.create({term, definition, deck: req.params.id});
    await Deck.findByIdAndUpdate(req.params.id, {$push: {cards: newCard.save()}});
     
    res.status(201).json(newCard);
};

const updateFlashcard = async (req, res) => {
    const card = Flashcard.findById(req.params.id);

    if (!card) {
        res.status(404);
        throw("Card not found!");
    }

    const newCard = card.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(newCard);
}

const deleteFlashcard = async (req, res) => {
    const deleteCard = await Flashcard.findByIdAndDelete(req.params.id);
    await Deck.findByIdAndUpdate(req.params.id, {$pull: {cards: deleteCard._id}});

    res.status(201).send(`Deleted card with ID: ${req.params.id}`);
};

module.exports = {createFlashcard, updateFlashcard, deleteFlashcard};