/**
 * DESCRIPTION: Verifies that the user associated with the item being modified (whether it's a deck or a card) is authorized
 *              to modify the item
 * 
 * USED IN: updateDeck, deleteDeck, createFlashcard, updateFlashcard, deleteFlashcard
 */
const isOwner = (model) => async (req, res, next) => {
    try {
        // uses the ID in the request parameter and the model passed into the function to find the exact item (deck, card) that is being modified
        const modifyItem = await model.findById(req.params.id);

        if (!modifyItem) {
            const err = new Error("Item does not exist");
            err.statusCode = 404;
            throw err;
        }

        if (modifyItem.user._id.toString() != req.user.id) {
            const err = new Error("User is not authorized to modify item");
            err.statusCode = 403;
            throw err;
        }

        next();
    } catch (err) {
        next(err);
    }
}


// EXPORTS: isOwner
module.exports = isOwner;