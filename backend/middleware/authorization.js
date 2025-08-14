/**
 * DESCRIPTION: Verifies that the user associated with the item being modified (whether it's a deck or a card) is authorized
 *              to modify the item
 * 
 * USED IN: updateDeck, deleteDeck, createFlashcard, updateFlashcard, deleteFlashcard
 */
const isOwner = (model) => async (req, res, next) => {
    // uses the ID in the request parameter and the model passed into the function to find the exact item (deck, card) that is being modified
    const modifyItem = await model.findById(req.params.id);

    if (!modifyItem) {
        return res.status(401).json({message: "Item does not exist"});
    }

    if (modifyItem.user._id.toString() != req.user.id) {
        return res.status(401).json({message: "User is not authorized to modify item"});
    }

    next();
}


// EXPORTS: isOwner
module.exports = isOwner;