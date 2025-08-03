let decks = [];

const getDecks = (req, res) => {
    res.json(decks);
};

const getDeckById = (req, res) => {
    res.status(201).send(`Get deck ${req.params.deckId}`);
}

const createDeck = (req, res) => {
    const newDeck = req.body;
    decks.push(newDeck);
    res.status(201).json(newDeck);
};

const deleteDeck = (req, res) => {
    res.status(201).send(`Delete deck ${req.params.deckId}`);
};

module.exports = {getDecks, getDeckById, createDeck, deleteDeck};