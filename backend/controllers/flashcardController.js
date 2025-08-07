// IMPORTS: Flashcard and Deck models
const Flashcard = require("../models/flashcardModel");
const Deck = require("../models/deckModel");


/**
 * ROUTE: POST /api/flashcards/:id
 * DESCRIPTION: Creates a card by taking the term and definition passed into the request body and the deck ID passed into the
 *              parameters, and adds it to the corresponding deck
 */
const createFlashcard = async (req, res) => {
    try {
        const deckId = req.params.id;
        const {term, definition} = req.body;

        // Data validation -- if a term or definition value passed in is null, then don't accept it; otherwise, create the card
        if (!term || !definition) {
            res.status(400).json({message: "Term and definition both need to be filled."});
        }

        // creates a new card using the term and definition passed into the request body
        const newCard = await Flashcard.create({term, definition, deck: deckId});
        const savedCard = await newCard.save();
        
        // adds the new card's ID to the array of card IDs of the card's deck
        await Deck.findByIdAndUpdate(req.params.id, {$push: {cards: savedCard._id}});
        
        res.status(201).json(savedCard);
    } catch (err) {
        console.log(err);
    }
};


/**
 * ROUTE: PUT /api/flashcards/:id
 * DESCRIPTION: Finds the flashcard by the card's ID passed into the request parameters, then updates the term and definition
 *              to the content in the request body
 */
const updateFlashcard = async (req, res) => {
    try {
        const cardId = req.params.id;
        const newCard = await Flashcard.findByIdAndUpdate(cardId, req.body, {new: true});

        // Validation -- if newCard is null (i.e. no card was found by cardId in the Flashcard model), then throw a 
        // 404 status error
        if (!newCard) {
            res.status(404);
            throw("Card not found!");
        }

        res.status(200).json(newCard);
    } catch (err) {
        console.log(err);
    }
}


/**
 * ROUTE: DELETE /api/flashcards/:id
 * DESCRIPTION: Finds the corresponding flashcard by the card's ID passed into the request parameters, deletes it, and removes
 *              it from its deck
 */
const deleteFlashcard = async (req, res) => {
    try {
        const cardId = req.params.id;
        const deleteCard = await Flashcard.findByIdAndDelete(cardId);

        // Validation -- if deleteCard is null (i.e. no card was found using cardId in the entire Flashcard model), then throw 
        // a 404 status error
        if (!deleteCard) {
            res.status(404);
            throw("Card not found!");
        }
        
        // removes the ID of the deleted card from the array in the Deck model
        await Deck.findByIdAndUpdate(deleteCard.deck, {$pull: {cards: deleteCard._id}});

        res.status(201).send(`Deleted card with ID: ${req.params.id}`);
    } catch (err) {
        console.log(err);
    }
};

// EXPORTS: createFlashcard, updateFlashcard, deleteFlashcard
module.exports = {createFlashcard, updateFlashcard, deleteFlashcard};