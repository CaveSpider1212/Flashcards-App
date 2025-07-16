import { useEffect, useState } from "react";
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
        }
    }, [selectedDeck]); // run each time selectedDeck changes

    return (
        <>
            <div>
                <label htmlFor="decks">Choose a deck from the dropdown:</label>

                <select name="decks" defaultValue="" onChange={(e) => selectDeck(e.target.value)}>
                    <option value="" disabled hidden>--Please choose a deck to edit--</option>

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
                <Flashcard term={currentCard.term} definition={currentCard.definition} cardType="card study" />

                <input type="submit" value="&larr;" />
                <input type="submit" value="&rarr;" />
            </div>
        </>
    )
}

export default Study