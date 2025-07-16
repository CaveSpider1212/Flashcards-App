import { useEffect, useState } from "react"
import DeckView from "../components/DeckView";

function Decks () {
    const [decks, setDecks] = useState([]);

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

export default Decks