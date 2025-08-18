import Flashcard from "./Flashcard"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDeckById, getCards } from "../api";
import "../css/DeckView.css"

/**
 * Function for the deck view component
 */

function DeckView ({deckId}) {
    /**
     * State variables
     */
    const [deck, setDeck] = useState([]); // represents the actual deck passed into the function (which includes deck name), set to an empty array [] by default
    const [cards, setCards] = useState([]); // represents the array of cards in the deck, set to an empty array [] by default


    /**
     * Other setup
     */
    const navigate = useNavigate(); // sets up the navigation to different pages


    /**
     * Calls the getCards function using the deck ID passed into this component, then sets the cards state array to the returned data
     * Calls the getDeckById function using the deck ID, then sets the deck state array to the returned data
     */
    useEffect(() => {
        getCards(deckId).then((data) => {
            setCards(data);
        });

        getDeckById(deckId).then((data) => {
            setDeck(data);
        });
    }, []);


    /**
     * Navigates to the "Manage Deck" page and edits the deck using the deckNumber ID value
     * Called when the "Edit" button for a deck is pressed
     */
    const handleEdit = () => {
        navigate(`/manage/${deckId}`);
    }


    /**
     * Navigates to the "Study" page and shows the corresponding deck by the deckNumber value
     * Called when the "Study" button for a deck is pressed
     */
    const handleStudy = () => {
        navigate(`/study/${deckId}`);
    }


    /**
     * Removes a deck from the local storage using the deckNumber ID value passed into this component
     * Reloads the screen afterwards
     * Called when the "Delete" button for a deck is pressed
     */
    const deleteDeck = () => {
        /*
        localStorage.removeItem(`deck${deckNumber}`);
        localStorage.removeItem(`deck${deckNumber}name`);
        */

        window.location.reload(); // refreshes the page after removing deck (to make sure it was actually removed on the screen)
    }


    /**
     * <Flashcard> shows a preview of the first card in the deck
     * <h1> shows a header with the name of the deck
     * <div> contains a list of buttons, "Edit," "Study," and "Delete," which have different functions when pressed
     */
    return (
        <div className="deck-view">
            <div className="top-left">
                {cards.length > 0 ? (
                    <Flashcard term={cards[0].term} definition={cards[0].definition} cardType="card overview" />
                ) : (
                    <Flashcard cardType="card overview" />
                )}
            </div>

            <div className="top-right">
                <h1 className="deck-header">{deck.name}</h1>
                <p className="deck-count">Cards: {cards.length}</p>
            </div>

            <div className="bottom">
                <input type="submit" value="Edit" onClick={handleEdit} className="edit-button" />
                <input type="submit" value="Study" onClick={handleStudy} className="study-button" />
                <input type="submit" value="Delete" onClick={deleteDeck} className="delete-button" />
            </div>
        </div>
    )

}

export default DeckView;