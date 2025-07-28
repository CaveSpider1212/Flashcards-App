import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Flashcard from "../components/Flashcard";
import "../css/Study.css"

/**
 * Function for the "Study" page
 */

function Study () {

    /**
     * State variables
     */
    const [decks, setDecks] = useState([]); // represents the available decks read from localStorage, set to an empty array [] by default (no decks read in)
    const [selectedDeck, setSelectedDeck] = useState([]); // represents the deck selected by the dropdown, set to an empty array [] by default (no deck selected)
    const [selectedName, setSelectedName] = useState(""); // represents the name of the selected deck, set to an empty string "" by default
    const [currentCard, setCurrentCard] = useState([]); // represents the current card being shown on the screen, set to an empty array [] by default
    const [index, setIndex] = useState(0); // represents the index of the card shown on the screen, set to 0 by default
    const [isDeckSelected, setIsDeckSelected] = useState(false); // represents whether a deck has been selected or not, set to false by default


    /**
     * Other setup
     */
    const {deckId} = useParams(); // reads the number parameter from the URL (used to determine if the user already selected a deck to study in the "Decks" page)


    /**
     * Reads in each deck and deck name from the localStorage and pushes the name, deck, and number into the loadedDecks array
     * The loadedDecks array is set as the decks state array
     * Runs only once (indicated by the empty array [])
     */
    useEffect(() => {
        const maxDeckNum = parseInt(localStorage.getItem("maxDeckNum"));
        const loadedDecks = [];

        for (let currentDeckNum = 1; currentDeckNum <= maxDeckNum; currentDeckNum++) {
            const currentDeck = JSON.parse(localStorage.getItem(`deck${currentDeckNum}`));
            const currentDeckName = localStorage.getItem(`deck${currentDeckNum}name`);

            if (currentDeck && currentDeckName) {
                loadedDecks.push({currentDeckName, currentDeck, currentDeckNum});
            }
        }

        setDecks(loadedDecks);
    }, []);


    /**
     * Reads the corresponding deck from the localStorage based on the deckId value into "deck"
     * Sets the selected deck state array to the "deck" array
     * Runs every time deckId changes, shown by [deckId]
     */
    useEffect(() => {
        if (deckId != 0) { // if the deckId (number read from URL) is not 0 (i.e. user is editing an existing deck), then get the corresponding deck and name from the localStorage
            const deck = JSON.parse(localStorage.getItem(`deck${deckId}`));
            setSelectedDeck(deck);

            const deckName = localStorage.getItem(`deck${deckId}name`);
            setSelectedName(deckName);
        }
    }, [deckId]);


    /**
     * Sets the card state to the first card in the deck, the index state to 0, and isDeckSelected to true
     * Run each time selectedDeck changes (i.e. each time a deck is selected)
     */
    useEffect(() => {
        if (selectedDeck && selectedDeck.length > 0) { // if a deck has been selected and isn't empty, set the current card to the first card of the deck
            setCurrentCard(selectedDeck[0]);
            setIndex(0);
            setIsDeckSelected(true);
        }
    }, [selectedDeck]);


    /**
     * Sets the current card to the corresponding card in the selectedDeck state by the index
     * Runs each time the index state changes, indicated by [index]
     */
    useEffect(() => {
        if (index < selectedDeck.length && index >= 0) { // if the index isn't out of bounds of the deck
            setCurrentCard(selectedDeck[index]);
        }
    }, [index]);
    

    /**
     * Iterates through each deck in the decks state array, ands sets the selected deck state array to the deck whose name is equal to the value selected in the dropdown menu
     * Based on the selectedValue value passed into the function
     * Called when the deck dropdown menu value changes
     */
    const selectDeck = (selectedValue) => {
        decks.forEach((deck) => {
            if (deck.currentDeckName === selectedValue) {
                // if the name of the current deck in the forEach loop is the same as the value selected, set the selectedDeck to the current deck
                setSelectedDeck(deck.currentDeck);
                setSelectedName(deck.currentDeckName);
            }
        })
    }


    /**
     * Increments index by 1 and sets the index state to the new value
     * Called when the right arrow button under the card is pressed
     */
    const nextCard = () => {
        let i = index;

        if (i + 1 < selectedDeck.length) { // if the new index wouldn't go past the deck bounds, increment by 1
            setIndex(++i);
        }
        else { // if the new index would go past the deck bounds, set it back to 0 (the first card)
            setIndex(0);
        }
    }

    
    /**
     * Decrements index by 1 and sets the index state to the new value
     * Called when the left arrow button under the card is pressed
     */
    const prevCard = () => {
        let i = index;

        if (i - 1 >= 0) { // if the new index wouldn't go past the deck bounds, decrement by 1
            setIndex(--i);
        }
        else { // if the new index would go past the deck bounds, set it to the length of the deck - 1 (the last card)
            setIndex(selectedDeck.length - 1);
        }
    }


    /**
     * Contains <label> and <select> elements for the dropdown menu selection
     * In the <select> element, a default <option> element is created, and the program creates new <option> elements for each deck in the decks state array with the value set to the name
     *      of each deck
     * Contains a <div> element containing the current card, which shows the term and definition of the current card and includes buttons below the card to go to the next
     *      or previous card
     */
    return (
        <>
            <div className="select-container">
                <select name="decks" defaultValue="" onChange={(e) => selectDeck(e.target.value)} className="study-select-input" >
                    <option value="" disabled hidden>--Please choose a deck to study--</option>

                    {decks.map((deck, index) => { // in the Select dropdown, shows the deck names for each of the decks loaded from the localStorage
                        return (
                            <option key={index} value={deck.currentDeckName}>
                                {deck.currentDeckName}
                            </option>
                        )
                    })}
                </select>
            </div>
            
            <div className="header-container">
                <h3>{selectedName}</h3>
            </div>

            <div className="card-container">
                {isDeckSelected && (
                    <div className="study-card">
                        {selectedDeck.length > 0 ? (
                            <Flashcard term={currentCard.term} definition={currentCard.definition} cardType="card study" />
                        ) : (
                            <Flashcard cardType="card study" />
                        )}

                        <div className="study-bottom-container">
                            <div>
                                <button onClick={prevCard} className="left-button"> &larr; </button>
                                <button onClick={nextCard} className="right-button">&rarr;</button>
                            </div>

                            {selectedDeck.length > 0 && (
                                <p>{index + 1}/{selectedDeck.length}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )

}

export default Study;