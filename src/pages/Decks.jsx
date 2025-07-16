import { useEffect, useState } from "react"
import DeckView from "../components/DeckView";

/**
 * Function for the "Decks" page
 */

function Decks () {

    /**
     * State variables
     */
    const [decks, setDecks] = useState([]); // represents the array of decks pulled from localStorage, set to an empty array by default


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
     * Creates a <div> element, which contains the <DeckView> components for each member of the decks state array
     */
    return (
        <>
            <p><i>Create a deck in the "Manage Decks" menu!</i></p>
            
            <div>
                {decks.map((deck, index) => (
                    <DeckView key={index} currentDeck={deck.currentDeck} deckName={deck.currentDeckName} deckNumber={parseInt(deck.currentDeckNum)} />
                ))}
            </div>
        </>
    )

}

export default Decks;