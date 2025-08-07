const Flashcard = require("../models/flashcardModel");
const Deck = require("../models/deckModel");

const createFlashcard = async (req, res) => {
    try {
        const deckId = req.params.id;
        const {term, definition} = req.body;

        if (!term || !definition) {
            res.status(400).json({message: "Term and definition both need to be filled."});
        }

        const newCard = await Flashcard.create({term, definition, deck: deckId});
        const savedCard = await newCard.save();

        await Deck.findByIdAndUpdate(req.params.id, {$push: {cards: savedCard._id}});
        
        res.status(201).json(savedCard);
    } catch (err) {
        console.log(err);
    }
};

const updateFlashcard = async (req, res) => {
    try {
        const newCard = await Flashcard.findByIdAndUpdate(req.params.id, req.body, {new: true});

        if (!newCard) {
            res.status(404);
            throw("Card not found!");
        }

        res.status(200).json(newCard);
    } catch (err) {
        console.log(err);
    }
}

const deleteFlashcard = async (req, res) => {
    try {
        const deleteCard = await Flashcard.findByIdAndDelete(req.params.id);

        if (!deleteCard) {
            res.status(404);
            throw("Card not found!");
        }
        
        await Deck.findByIdAndUpdate(deleteCard.deck, {$pull: {cards: deleteCard._id}});

        res.status(201).send(`Deleted card with ID: ${req.params.id}`);
    } catch (err) {
        console.log(err);
    }
};

module.exports = {createFlashcard, updateFlashcard, deleteFlashcard};