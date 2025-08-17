import { useEffect, useState } from "react"
import DeckView from "../components/DeckView";
import "../css/Decks.css"
import { getCurrentUser } from "../api";

/**
 * Function for the "Decks" page
 */

function Decks () {

    /**
     * State variables
     */
    const [user, setUser] = useState(null); // represents the user logged in, set to null by default
    const [decks, setDecks] = useState([]); // represents the array of decks of the user, set to an empty array by default


    /**
     * Reads in each deck and deck name from the localStorage and pushes the name, deck, and number into the loadedDecks array
     * The loadedDecks array is set as the decks state array
     * Runs only once (indicated by the empty array [])
     */
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            getCurrentUser(token).then((data) => setUser(data));
        }
        else {
            setUser(null);
        }
    }, []);


    /**
     * Creates a <div> element, which contains the <DeckView> components for each member of the decks state array
     */
    return (
        <>
        {user == null ? (
            <p className="auth-message">Must be logged in to view decks!</p>
        ) : (
            <>
            {decks.length == 0 && (
                <p className="decks-message">Create a deck in the "Manage Deck" menu!</p>
            )}

            <div>
                {decks.map((deck, index) => (
                    <DeckView key={index} currentDeck={deck.currentDeck} deckName={deck.currentDeckName} deckNumber={parseInt(deck.currentDeckNum)} />
                ))}
            </div>
            </>
        )}
        </>
    )

}

export default Decks;