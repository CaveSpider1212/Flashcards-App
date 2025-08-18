// IMPORTS: Deck and Flashcard models
const Deck = require("../models/deckModel");
const Flashcard = require("../models/flashcardModel");
const User = require("../models/userModel");


/**
 * ROUTE: GET /api/decks/
 * DESCRIPTION: Displays information of all decks stored in the Deck model for the logged-in user in JSON format
 */
const getDecks = async (req, res) => {
    const decks = await Deck.find({user: req.user.id}); // shows all decks of the current logged-in user
    res.status(200).json(decks);
};



/**
 * ROUTE: GET /api/decks/:id
 * DESCRIPTION: Finds a specific deck by ID and displays the information to the response in JSON format
 */
const getDeckById = async (req, res, next) => {
    try {
        const deckId = req.params.id;
        const deck = await Deck.findById(deckId);

        // Validation -- if deck is null (i.e. a deck was not found using deckId), throw a 404 status error
        if (!deck) {
            const err = new Error("Deck not found");
            err.statusCode = 404;
            throw err;
        }

        res.status(200).json(deck);
    } catch (err) {
        next(err);
    }
}

/**
 * ROUTE: PUT /api/decks/:id
 * DESCRIPTION: Finds the corresponding deck by the ID passed into the request parameters, then updates the name and description
 *              to the content in the request body
 */
const updateDeck = async (req, res, next) => {
    try {
        const deckId = req.params.id;
        const {name} = req.body;
        const newDeck = await Deck.findByIdAndUpdate(deckId, {name: name}, {new: true});

        // Validation -- if newDeck is null (i.e. a deck was not found using deckId), throw a 404 status error
        if (!newDeck) {
            const err = new Error("Deck not found");
            err.statusCode = 404;
            throw err;
        }

        res.status(200).json(newDeck);
    } catch (err) {
        next(err);
    }
}


/**
 * ROUTE: POST /api/decks/
 * DESCRIPTION: Takes the name and description from the request body and creates a new deck, adding it to the decks collection
 *              in the database
 */
const createDeck = async (req, res, next) => {
    try {
        const {name} = req.body;
        const userId = req.user.id;
        
        // Data validation -- if name is null, then don't accept the request; otherwise, create the deck using the request body values
        if (!name) {
            const err = new Error("Name is required");
            err.statusCode = 400;
            throw err;
        }

        // Creates a new deck, and adds it to the array of deck ID's of the user
        const newDeck = await Deck.create({name, user: userId});
        await User.findByIdAndUpdate(userId, {$push: {decks: newDeck._id}});

        res.status(201).json(newDeck);
    } catch (err) {
        next(err);
    }
};


/**
 * ROUTE: DELETE /api/decks/:id
 * DESCRIPTION: Finds the corresponding deck by the request parameter and deletes it
 */
const deleteDeck = async (req, res, next) => {
    try {
        const deckId = req.params.id;
        
        // Deletes all flashcards associated with the deck
        await Flashcard.deleteMany({deck: deckId});

        const deleteDeck = await Deck.findByIdAndDelete(deckId);

        // Validation -- if deleteDeck is null (i.e. a deck was not found with deckId), throw a 404 status error
        if (!deleteDeck) {
            const err = new Error("Deck not found");
            err.statusCode = 404;
            throw err;
        }

        // Removes the deck from the array of decks of the user
        await User.findByIdAndUpdate(deleteDeck.user, {$pull: {decks: deleteDeck._id}});

        res.status(200).send(`Deleted deck with ID: ${deleteDeck._id}`);
    } catch (err) {
        next(err);
    }
};

// EXPORTS: getDecks, getDeckById, updateDeck, createDeck, deleteDeck
module.exports = {getDecks, getDeckById, updateDeck, createDeck, deleteDeck};