const Deck = require("../models/deckModel");
const Flashcard = require("../models/flashcardModel");

const getDecks = async (req, res) => {
    const decks = await Deck.find();
    res.json(decks);
};

const getDeckById = async (req, res) => {
    const deck = await Deck.findById(req.params.id);

    if (!deck) {
        res.status(404);
        throw("Deck not found!");
    }

    res.status(201).json(deck);
}

const createDeck = async (req, res) => {
    const {name, description} = req.body;
    const newDeck = await Deck.create({name, description});
    res.status(201).json(newDeck);
};

const deleteDeck = async (req, res) => {
    await Flashcard.deleteMany({deck: req.params.id});
    await Deck.findByIdAndDelete(req.params.id);

    res.status(201).send(`Deleted deck with ID: ${req.params.id}`);
};

module.exports = {getDecks, getDeckById, createDeck, deleteDeck};