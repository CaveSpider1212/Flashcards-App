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
    const [loading, setLoading] = useState(true); // represents whether the server "get" functions are actively being run (i.e. program is loading), set to false by default


    /**
     * Reads the token from the local storage
     * If found, sets the user state variable to the user asssociated with the token using currentUser() function
     */
    useEffect(() => {
        const getUserAndDecks = async () => {
            try {
                const token = localStorage.getItem("token");

                if (token) {
                    await currentUser(token).then((data) => setUser(data));
                    await getDecks(token).then((data) => {
                        setDecks(data);
                    })
                }
                else {
                    setUser(null);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        getUserAndDecks();
    }, []);


    /**
     * If program is loading (i.e. loading == true), show a loading message
     * Creates a <div> element, which contains the <DeckView> components for each member of the decks state array
     */
    return (
        <>
        {loading ? (
            <p className="loading-message">Loading decks...</p>
        ) : (
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
        )}
        
        </>
    )

}

export default Decks;