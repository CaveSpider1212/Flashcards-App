import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Flashcard from "../components/Flashcard";

function Study () {
    const maxDeckNum = parseInt(localStorage.getItem("maxDeckNum"));
        const loadedDecks = [];
    
        for (let currentDeckNum = 1; currentDeckNum <= maxDeckNum; currentDeckNum++) {
            const currentDeck = JSON.parse(localStorage.getItem(`deck${currentDeckNum}`));
            const currentDeckName = localStorage.getItem(`deck${currentDeckNum}name`);
    
            if (currentDeck && currentDeckName) {
                loadedDecks.push({currentDeckName, currentDeck, currentDeckNum});
            }
        }
    
    const [selectedDeck, setSelectedDeck] = useState([]);
    const [currentCard, setCurrentCard] = useState([]);
    const [index, setIndex] = useState(0);
    const [isDeckSelected, setIsDeckSelected] = useState(false);

    const {deckId} = useParams();

    useEffect(() => {
        if (deckId != 0) { // if the deckId (number read from URL) is not 0 (i.e. user is editing an existing deck), then get the corresponding deck and name from the localStorage
            const deck = JSON.parse(localStorage.getItem(`deck${deckId}`));
            setSelectedDeck(deck);
        }
    }, [deckId]); // runs every time deckId changes

    const selectDeck = (selectedValue) => {
        loadedDecks.forEach((deck) => {
            if (deck.currentDeckName === selectedValue) {
                // if the name of the current deck in the forEach loop is the same as the value selected, set the selectedDeck to the current deck
                setSelectedDeck(deck.currentDeck);
            }
        })
    }

    useEffect(() => {
        if (selectedDeck && selectedDeck.length > 0) { // if a deck has been selected and isn't empty, set the current card to the first card of the deck
            setCurrentCard(selectedDeck[0]);
            setIndex(0);
            setIsDeckSelected(true);
        }
    }, [selectedDeck]); // run each time selectedDeck changes

    const nextCard = () => {
        let i = index;

        if (i + 1 < selectedDeck.length) {
            setIndex(++i);
        }
    }

    const prevCard = () => {
        let i = index;

        if (i - 1 >= 0) {
            setIndex(--i);
        }
    }

    useEffect(() => {
        if (index < selectedDeck.length && index >= 0) {
            setCurrentCard(selectedDeck[index]);
        }
    }, [index]);

    return (
        <>
            <div>
                <label htmlFor="decks">Choose a deck from the dropdown:</label>

                <select name="decks" defaultValue="" onChange={(e) => selectDeck(e.target.value)}>
                    <option value="" disabled hidden>--Please choose a deck to study--</option>

                    {loadedDecks.map((deck, index) => { // in the Select dropdown, shows the deck names for each of the decks loaded from the localStorage
                        return (
                            <option key={index} value={deck.currentDeckName}>
                                {deck.currentDeckName}
                            </option>
                        )
                    })}
                </select>
            </div>

            <div>
                {isDeckSelected && (
                    <div>
                        <Flashcard term={currentCard.term} definition={currentCard.definition} cardType="card study" />

                        <button onClick={prevCard}> &larr; </button>
                        <button onClick={nextCard}>&rarr;</button>

                        <p>{index + 1}/{selectedDeck.length}</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default Study