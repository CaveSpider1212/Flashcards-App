// IMPORTS: Flashcard and Deck models
const Flashcard = require("../models/flashcardModel");
const Deck = require("../models/deckModel");


/**
 * ROUTE: GET /api/flashcards/:id
 * DESCRIPTION: Shows all cards associated with a deck using the deckId passed in the request parameters
 */
const getFlashcards = async (req, res, next) => {
    const deckId = req.params.id;
    const decks = await Flashcard.find({deck: deckId});
    res.status(200).json(decks);
}


/**
 * ROUTE: POST /api/flashcards/:id
 * DESCRIPTION: Creates a card by taking the term and definition passed into the request body and the deck ID passed into the
 *              parameters, and adds it to the corresponding deck
 */
const createFlashcard = async (req, res, next) => {
    try {
        const deckId = req.params.id;
        const {term, definition} = req.body;
        const userId = req.user.id;

        // Data validation -- if a term or definition value passed in is null, then don't accept it; otherwise, create the card
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
        
        res.status(201).json(savedCard);
    } catch (err) {
        next(err);
    }
};


/**
 * ROUTE: PUT /api/flashcards/:id
 * DESCRIPTION: Finds the flashcard by the card's ID passed into the request parameters, then updates the term and definition
 *              to the content in the request body
 */
const updateFlashcard = async (req, res, next) => {
    try {
        const cardId = req.params.id;
        const {term, definition} = req.body;
        const newCard = await Flashcard.findByIdAndUpdate(cardId, {term: term, definition: definition}, {new: true});

        // Validation -- if newCard is null (i.e. no card was found by cardId in the Flashcard model), then throw a 
        // 404 status error
        if (!newCard) {
            const err = new Error("Card not found");
            err.statusCode = 404;
            throw err;
        }

        res.status(200).json(newCard);
    } catch (err) {
        next(err);
    }
}


/**
 * ROUTE: DELETE /api/flashcards/:id
 * DESCRIPTION: Finds the corresponding flashcard by the card's ID passed into the request parameters, deletes it, and removes
 *              it from its deck
 */
const deleteFlashcard = async (req, res, next) => {
    try {
        const cardId = req.params.id;
        const deleteCard = await Flashcard.findByIdAndDelete(cardId);

        // Validation -- if deleteCard is null (i.e. no card was found using cardId in the entire Flashcard model), then throw 
        // a 404 status error
        if (!deleteCard) {
            const err = new Error("Card not found");
            err.statusCode = 404;
            throw err;
        }
        
        // removes the ID of the deleted card from the array in the Deck model
        await Deck.findByIdAndUpdate(deleteCard.deck, {$pull: {cards: deleteCard._id}});

        res.status(200).send(`Deleted card with ID: ${deleteCard._id}`);
    } catch (err) {
        next(err);
    }
};

// EXPORTS: createFlashcard, updateFlashcard, deleteFlashcard
module.exports = {getFlashcards, createFlashcard, updateFlashcard, deleteFlashcard};