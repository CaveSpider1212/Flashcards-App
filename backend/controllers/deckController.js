// IMPORTS: Deck and Flashcard models
const Deck = require("../models/deckModel");
const Flashcard = require("../models/flashcardModel");


/**
 * ROUTE: GET /api/decks/
 * DESCRIPTION: Displays information of all decks stored in the Deck model in JSON format
 */
const getDecks = async (req, res) => {
    const decks = await Deck.find();
    res.json(decks);
};


/**
 * ROUTE: GET /api/decks/:id
 * DESCRIPTION: Finds a specific deck by ID and displays the information to the response in JSON format
 */
const getDeckById = async (req, res) => {
    try {
        const deckId = req.params.id;
        const deck = await Deck.findById(deckId);

        // Validation -- if deck is null (i.e. a deck was not found using deckId), throw a 404 status error
        if (!deck) {
            res.status(404);
            throw("Deck not found!");
        }

        res.status(201).json(deck);
    } catch (err) {
        console.log(err);
    }
}


/**
 * ROUTE: PUT /api/decks/:id
 * DESCRIPTION: Finds the corresponding deck by the ID passed into the request parameters, then updates the name and description
 *              to the content in the request body
 */
const updateDeck = async (req, res) => {
    try {
        const deckId = req.params.id;
        const newDeck = await Deck.findByIdAndUpdate(deckId, req.body, {new: true});

        // Validation -- if newDeck is null (i.e. a deck was not found using deckId), throw a 404 status error
        if (!newDeck) {
            res.status(404);
            throw("Deck not found!");
        }

        res.status(200).json(newDeck);
    } catch (err) {
        console.log(err);
    }
}


/**
 * ROUTE: POST /api/decks/
 * DESCRIPTION: Takes the name and description from the request body and creates a new deck, adding it to the decks collection
 *              in the database
 */
const createDeck = async (req, res) => {
    try {
        const {name, description} = req.body;
        
        // Data validation -- if name is null, then don't accept the request; otherwise, create the deck using the request body values
        if (!name) {
            res.status(400).json({message: "Name is required"});
        }

        const newDeck = await Deck.create({name, description});
        res.status(201).json(newDeck);
    } catch (err) {
        console.log(err);
    }
};


/**
 * ROUTE: DELETE /api/decks/:id
 * DESCRIPTION: Finds the corresponding deck by the request parameter and deletes it, if found, along with all flashcards associated
 *              with that deck
 */
const deleteDeck = async (req, res) => {
    try {
        const deckId = req.params.id;

        await Flashcard.deleteMany({deck: deckId});
        await Deck.findByIdAndDelete(deckId);

        res.status(201).send(`Deleted deck with ID: ${req.params.id}`);
    } catch (err) {
        console.log(err);
    }
};

// EXPORTS: getDecks, getDeckById, updateDeck, createDeck, deleteDeck
module.exports = {getDecks, getDeckById, updateDeck, createDeck, deleteDeck};