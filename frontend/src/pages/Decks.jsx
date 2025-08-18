import { useEffect, useState } from "react"
import DeckView from "../components/DeckView";
import "../css/Decks.css"
import { currentUser, getDecks, getCards } from "../api";

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
     * Reads the token from the local storage
     * If found, sets the user state variable to the user asssociated with the token using currentUser() function
     */
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            currentUser(token).then((data) => setUser(data));
            getDecks(token).then((data) => {
                setDecks(data);
            })
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
                    <DeckView key={index} deckId={deck._id} />
                ))}
            </div>
            </>
        )}
        </>
    )

}

export default Decks;