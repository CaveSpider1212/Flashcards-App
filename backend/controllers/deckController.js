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

    // returns a JSON of all decks found
    res.status(200).json(decks);
};



/**
 * ROUTE: GET /api/decks/:id
 * DESCRIPTION: Finds a specific deck by ID and displays the information to the response in JSON format
 */
const getDeckById = async (req, res, next) => {
    try {
        /**
         * Request parameters: Deck ID
         */
        const deckId = req.params.id;

        // finds deck by ID
        const deck = await Deck.findById(deckId);

        // Validation -- if deck is null (i.e. a deck was not found using deckId), throw an error
        if (!deck) {
            const err = new Error("Deck not found");
            err.statusCode = 404;
            throw err;
        }

        // returns a JSON of the deck's information (name, ID, created date, etc.) if found
        res.status(200).json(deck);
    } catch (err) {
        next(err); // passes error to error handling middleware
    }
}

/**
 * ROUTE: PUT /api/decks/:id
 * DESCRIPTION: Finds the corresponding deck by the ID passed into the request parameters, then updates the name and description
 *              to the content in the request body
 */
const updateDeck = async (req, res, next) => {
    try {
        /**
         * Request parameters: Deck ID
         * Request body: Deck name
         */
        const deckId = req.params.id;
        const {name} = req.body;

        // Data validation -- if name is null, then throw an error and don't accept the request
        if (!name) {
            const err = new Error("Name is required");
            err.statusCode = 400;
            throw err;
        }

        // finds the corresponding deck by ID and updates its name if found
        const newDeck = await Deck.findByIdAndUpdate(deckId, {name: name}, {new: true});

        // Validation -- if newDeck is null (i.e. a deck was not found using deckId), throw an error
        if (!newDeck) {
            const err = new Error("Deck not found");
            err.statusCode = 404;
            throw err;
        }

        // returns a JSON of the updated deck's information (name, ID, created date, etc.) if successful
        res.status(200).json(newDeck);
    } catch (err) {
        next(err); // passes error to error handling middleware
    }
}


/**
 * ROUTE: POST /api/decks/
 * DESCRIPTION: Takes the name and description from the request body and creates a new deck, adding it to the decks collection
 *              in the database
 */
const createDeck = async (req, res, next) => {
    try {
        /**
         * Request body: Deck name
         * Request user: Logged-in user
         */
        const {name} = req.body;
        const userId = req.user.id;
        
        // Data validation -- if name is null, then throw an error and don't accept the request
        if (!name) {
            const err = new Error("Name is required");
            err.statusCode = 400;
            throw err;
        }

        // Creates a new deck, and adds it to the array of deck ID's of the user
        const newDeck = await Deck.create({name, user: userId});
        await User.findByIdAndUpdate(userId, {$push: {decks: newDeck._id}});

        // returns JSON of new deck's information (name, ID, created date, etc.) if successful
        res.status(201).json(newDeck);
    } catch (err) {
        next(err); // passes error to error handling middleware
    }
};


/**
 * ROUTE: DELETE /api/decks/:id
 * DESCRIPTION: Finds the corresponding deck by the request parameter and deletes it
 */
const deleteDeck = async (req, res, next) => {
    try {
        /**
         * Request parameters: Deck ID
         */
        const deckId = req.params.id;
        
        // Deletes all flashcards associated with the deck
        await Flashcard.deleteMany({deck: deckId});

        // finds a deck in the Deck model by the ID and deletes it, if found
        const deleteDeck = await Deck.findByIdAndDelete(deckId);

        // Validation -- if deleteDeck is null (i.e. a deck was not found with deckId), throw a 404 status error
        if (!deleteDeck) {
            const err = new Error("Deck not found");
            err.statusCode = 404;
            throw err;
        }

        // Removes the deck from the array of decks of the user
        await User.findByIdAndUpdate(deleteDeck.user, {$pull: {decks: deleteDeck._id}});

        // returns JSON of confirmation message with deleted deck's ID
        res.status(200).send(`Deleted deck with ID: ${deleteDeck._id}`);
    } catch (err) {
        next(err); // passes error to error handling middleware
    }
};

// EXPORTS: getDecks, getDeckById, updateDeck, createDeck, deleteDeck
module.exports = {getDecks, getDeckById, updateDeck, createDeck, deleteDeck};