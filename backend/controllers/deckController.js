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
        const {name, description} = req.body;
        const newDeck = await Deck.findByIdAndUpdate(deckId, {name: name, description: description}, {new: true});

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
        const userId = req.user.id;
        
        // Data validation -- if name is null, then don't accept the request; otherwise, create the deck using the request body values
        if (!name) {
            res.status(400).json({message: "Name is required"});
        }

        // Creates a new deck, and adds it to the array of deck ID's of the user
        const newDeck = await Deck.create({name, description, user: userId});
        await User.findByIdAndUpdate(userId, {$push: {decks: newDeck._id}});

        res.status(201).json(newDeck);
    } catch (err) {
        console.log(err);
    }
};


/**
 * ROUTE: DELETE /api/decks/:id
 * DESCRIPTION: Finds the corresponding deck by the request parameter and deletes it
 */
const deleteDeck = async (req, res) => {
    try {
        const deckId = req.params.id;
        
        // Deletes all flashcards associated with the deck
        await Flashcard.deleteMany({deck: deckId});

        const deleteDeck = await Deck.findByIdAndDelete(deckId);

        // Removes the deck from the array of decks of the user
        await User.findByIdAndUpdate(deleteDeck.user, {$pull: {decks: deleteDeck._id}});

        res.status(201).send(`Deleted deck with ID: ${deleteDeck._id}`);
    } catch (err) {
        console.log(err);
    }
};

// EXPORTS: getDecks, getDeckById, updateDeck, createDeck, deleteDeck
module.exports = {getDecks, getDeckById, updateDeck, createDeck, deleteDeck};