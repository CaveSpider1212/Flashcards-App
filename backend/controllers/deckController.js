const Deck = require("../models/deckModel");
const Flashcard = require("../models/flashcardModel");

const getDecks = async (req, res) => {
    const decks = await Deck.find();
    res.json(decks);
};

const getDeckById = async (req, res) => {
    try {
        const deck = await Deck.findById(req.params.id);

        if (!deck) {
            res.status(404);
            throw("Deck not found!");
        }

        res.status(201).json(deck);
    } catch (err) {
        console.log(err);
    }
}

const updateDeck = async (req, res) => {
    try {
        const deck = await Deck.findById(req.params.id);

        if (!deck) {
            res.status(404);
            throw("Deck not found!");
        }

        const newDeck = await Deck.findByIdAndUpdate(req.params.id, req.body, {new: true});

        res.status(200).json(newDeck);
    } catch (err) {
        console.log(err);
    }
}

const createDeck = async (req, res) => {
    try {
        const {name, description} = req.body;

        if (!name || !description) {
            res.status(400).json({message: "Name and description both required"});
        }

        const newDeck = await Deck.create({name, description});
        res.status(201).json(newDeck);
    } catch (err) {
        console.log(err);
    }
};

const deleteDeck = async (req, res) => {
    try {
        await Flashcard.deleteMany({deck: req.params.id});
        await Deck.findByIdAndDelete(req.params.id);

        res.status(201).send(`Deleted deck with ID: ${req.params.id}`);
    } catch (err) {
        console.log(err);
    }
};

module.exports = {getDecks, getDeckById, updateDeck, createDeck, deleteDeck};