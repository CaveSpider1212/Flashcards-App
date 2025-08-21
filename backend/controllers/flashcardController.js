// IMPORTS: Flashcard and Deck models
const Flashcard = require("../models/flashcardModel");
const Deck = require("../models/deckModel");


/**
 * ROUTE: GET /api/flashcards/:id
 * DESCRIPTION: Shows all cards associated with a deck using the deckId passed in the request parameters
 */
const getFlashcards = async (req, res, next) => {
    /**
     * Request parameters: Deck ID
     */
    const deckId = req.params.id;

    // finds all flashcards of a given deck (looks for all cards with deck value of deckId)
    const cards = await Flashcard.find({deck: deckId});

    // returns a JSON of all cards found
    res.status(200).json(cards);
}


/**
 * ROUTE: POST /api/flashcards/:id
 * DESCRIPTION: Creates a card by taking the term and definition passed into the request body and the deck ID passed into the
 *              parameters, and adds it to the corresponding deck
 */
const createFlashcard = async (req, res, next) => {
    try {
        /**
         * Request parameters: Deck ID
         * Request body: Card term, Card definition
         * Request user: Logged-in user
         */
        const deckId = req.params.id;
        const {term, definition} = req.body;
        const userId = req.user.id;

        // Data validation -- if a term or definition value passed in is null, then throw an error and don't accept the request
        if (!term || !definition) {
            const err = new Error("Term and definition are both required");
            err.statusCode = 400;
            throw err;
        }

        // creates a new card using the term and definition passed into the request body
        const newCard = await Flashcard.create({term, definition, deck: deckId, user: userId});
        const savedCard = await newCard.save();
        
        // adds the new card's ID to the array of card IDs of the card's deck
        await Deck.findByIdAndUpdate(deckId, {$push: {cards: savedCard._id}});
        
        // returns a JSON of the new card
        res.status(201).json(savedCard);
    } catch (err) {
        next(err); // passes error to error handling middleware
    }
};


/**
 * ROUTE: PUT /api/flashcards/:id
 * DESCRIPTION: Finds the flashcard by the card's ID passed into the request parameters, then updates the term and definition
 *              to the content in the request body
 */
const updateFlashcard = async (req, res, next) => {
    try {
        /**
         * Request parameters: Card ID
         * Request body: Card term, Card definition
         */
        const cardId = req.params.id;
        const {term, definition} = req.body;

        // finds the corresponding card by ID and updates its term and definition if found
        const newCard = await Flashcard.findByIdAndUpdate(cardId, {term: term, definition: definition}, {new: true});

        // Validation -- if newCard is null (i.e. no card was found by cardId in the Flashcard model), then throw an error
        if (!newCard) {
            const err = new Error("Card not found");
            err.statusCode = 404;
            throw err;
        }

        // returns a JSON of the updated card
        res.status(200).json(newCard);
    } catch (err) {
        next(err); // passes error to error handling middleware
    }
}


/**
 * ROUTE: DELETE /api/flashcards/:id
 * DESCRIPTION: Finds the corresponding flashcard by the card's ID passed into the request parameters, deletes it, and removes
 *              it from its deck
 */
const deleteFlashcard = async (req, res, next) => {
    try {
        /**
         * Request parameters: Card ID
         */
        const cardId = req.params.id;

        // finds the corresponding flashcard by its ID and deletes it from the database if found
        const deleteCard = await Flashcard.findByIdAndDelete(cardId);

        // Validation -- if deleteCard is null (i.e. no card was found using cardId in the entire Flashcard model), then throw an error
        if (!deleteCard) {
            const err = new Error("Card not found");
            err.statusCode = 404;
            throw err;
        }
        
        // removes the ID of the deleted card from the array in the Deck model
        await Deck.findByIdAndUpdate(deleteCard.deck, {$pull: {cards: deleteCard._id}});

        // returns a JSON of a confirmation message with the deleted card's ID
        res.status(200).send(`Deleted card with ID: ${deleteCard._id}`);
    } catch (err) {
        next(err); // passes error to error handling middleware
    }
};

// EXPORTS: createFlashcard, updateFlashcard, deleteFlashcard
module.exports = {getFlashcards, createFlashcard, updateFlashcard, deleteFlashcard};