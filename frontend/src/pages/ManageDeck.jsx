import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Flashcard from "../components/Flashcard"
import { getCurrentUser } from "../api";
import "../css/ManageDeck.css";

/**
 * Function for the "Manage Deck" page
 */

function ManageDeck () {

    /**
     * State variables
     */
    const [cards, setCards] = useState([]); // represents the array of cards that are part of the deck being created/edited
    const [term, setTerm] = useState(''); // represents the value shown in the Term text input, set to an empty string '' by default
    const [definition, setDefinition] = useState(''); // represents the value shown in the Definition text input, set to an empty string '' by default
    const [name, setName] = useState(''); // represents the value shown in the Deck Name text input, set to an empty string '' by default
    const [editTerm, setEditTerm] = useState(''); // represents the value shown in the Term text input when editing a card, set to an empty string '' by default
    const [editDef, setEditDef] = useState(''); // represents the value shown in the Definition text input when editing a card, set to an empty string '' by default
    const [user, setUser] = useState(null); // represents the user logged in, set to null by default


    /**
     * Other setup
     */
    const {deckId} = useParams(); // reads the number parameter from the URL (used to determine whether user is editing a deck or not)
    const navigate = useNavigate(); // sets up the navigation to different pages


    /**
    * Reads in the "maxDeckNum" value from the localStorage
    * Sets the maxDeckNum variable to the value read in, if applicaple, otherwise sets it to 0
    */
    if (localStorage.getItem("maxDeckNum") == null) {
        var maxDeckNum = 0;
    } else {
        var maxDeckNum = localStorage.getItem("maxDeckNum");
    }


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
     * Reads the corresponding deck and deck name from the localStorage, and stores it in the loadedDecks and loadedName variables
     * Sets the cards and name state variables to loadedDecks and loadedName, respectively
     * Runs each time deckId changes, indicated by [deckId]
     */
    useEffect(() => {
        if (deckId != 0) { // if the deckId (number read from URL) is not 0 (i.e. user is editing an existing deck), then get the corresponding deck and name from the localStorage
            const loadedDecks = JSON.parse(localStorage.getItem(`deck${deckId}`));
            const loadedName = localStorage.getItem(`deck${deckId}name`);

            setCards(loadedDecks);
            setName(loadedName);
        }
    }, [deckId]);


    /**
     * Creates a newCard variable, with the term, definition, and editing values set; the term and definition values of newCard are set from the state variables
     * Adds the newCard object to the cards state array and resets the term and definition states
     * Called when the "Add Card" button is pressed
     */
    const addCard = () => {
        const newCard = {term, definition, editing: false};
        setCards((prevCards) => [...prevCards, newCard])

        setTerm('');
        setDefinition('');
    }


    /**
     * Saves the current deck to the localStorage (does slightly different things depending on deckId value, whether user is creating a new deck or editing an existing one)
     * Navigates to the "Decks" page after function is done executing
     * Called when the "Save Deck" button is pressed
     */
    const saveDeck = () => {
        if (deckId == 0) { // if the deckId is 0 (i.e. user is creating a new deck), add the new deck and name to the localStorage
            localStorage.setItem("maxDeckNum", ++maxDeckNum);
            localStorage.setItem(`deck${maxDeckNum}`, JSON.stringify(cards));
            localStorage.setItem(`deck${maxDeckNum}name`, name);
        }
        else { // if the deckID is NOT 0 (i.e. user is editing an existing deck), update the localStorage with the new deck/name
            localStorage.setItem(`deck${deckId}`, JSON.stringify(cards));
            localStorage.setItem(`deck${deckId}name`, name);
        }

        navigate('/');
    }


    /**
     * Toggles the current card's editing value (true or false), using the cardIndex passed into the function
     * If editing is changed to true, then also set the edit term and edit definition states to the current term/definition of the card the user is editing
     * Sets the cards state array to the updatedCards array
     * Called when the "Edit" button under a card is pressed
     */
    const toggleEdit = (cardIndex) => {
        const updatedCards = [...cards];

        if (cards[cardIndex].editing) {
            updatedCards[cardIndex].editing = false;
        }
        else {
            updatedCards[cardIndex].editing = true;

            setEditTerm(updatedCards[cardIndex].term);
            setEditDef(updatedCards[cardIndex].definition);
        }

        setCards(updatedCards);
    }


    /**
     * Sets the editing card's new term and definition to the editTerm and editDef state variables
     * Resets the editTerm and editDef states and sets the cards state array to updatedCards
     * Calls toggleEdit(), which sets the card's editing value to false
     * Called when the "Save card" button is pressed
     */
    const editCard = (editIndex) => {
        const updatedCards = [...cards];
        updatedCards[editIndex].term = editTerm;
        updatedCards[editIndex].definition = editDef;

        setEditTerm('');
        setEditDef('');
        setCards(updatedCards);

        toggleEdit(editIndex);
    }


    /**
     * Creates a new array, updatedCards, and pushes all cards whose index is not the same as the index of the card we are deleting to the array
     * Sets the cards state array to the updatedCards array
     * Called when the "Delete" button under a card is pressed
     */
    const deleteCard = (deleteIndex) => {
        const updatedCards = [];

        cards.map((card, index) => {
            if (index != deleteIndex) { // if the current card's index is not the index of the card we want to delete, push it to the array
                updatedCards.push(card);
            }
        })

        setCards(updatedCards);
    }


    /**
     * Contains a <div> element for the Deck name input
     * Contains a <div> element containing several text/button inputs for creating a new card (term input, definition input, adding card)
     * Contains a <div> element for the "Save Deck" button
     * Contains a <div> element for each of the cards in the current deck; program shows each cards by mapping the cards state array, seeing if the user is editing the card
     *      or not, and showing either the edit term and edit definition inputs or the card with the term and definition
     */
    return (
        <>
        {user == null ? (
            <p className="auth-message">Must be logged in to manage decks!</p>
        ) : (
            <>
            <div className="manage-deck-inputs">
                <div>
                    <input type="text" placeholder="Deck name" value={name} onChange={(e) => setName(e.target.value)} required="required" className="deck-name-input" />
                </div>

                <div>
                    <input type="text" placeholder="Term" value={term} onChange={(e) => setTerm(e.target.value)} required="required" className="term-input" />
                    <input type="text" placeholder="Definition" value = {definition} onChange={(e) => setDefinition(e.target.value)} required = "required" className="definition-input" />
                    <input type="submit" value="Add Card" onClick={addCard} className="add-term-input" />
                </div>
                
                <div>
                    <input type="submit" value="Save Deck" onClick={saveDeck} className="save-input" />
                </div>
            </div>

            {cards.length > 0 ? ( // shows a messsage depending on whether there are cards shown on the screen or not
                <p className="manage-deck-message">Click on a card to flip it!</p>
            ) : (
                <p className="manage-deck-message">Add a deck name, and create a card by adding a term and definition using the text inputs above!</p>
            )}

            <div className="manage-deck-card">
                {cards.map((card, index) => (
                    <div key={index}>
                        {/* shows either the text box for editing or the flashcard with the term and definition, depending on the value of card.editing */}

                        {card.editing ? (
                            <div>
                                <input type="text" value={editTerm} onChange={(e) => setEditTerm(e.target.value)} className="edit-term-input" />
                                <input type="text" value={editDef} onChange={(e) => setEditDef(e.target.value)} className="edit-definition-input" />
                                <input type="submit" value="Save card" onClick={() => editCard(index)} className="save-card-input" />
                            </div>
                        ) : (
                            <div>
                                <Flashcard term={card.term} definition={card.definition} cardType="card createdeck" />

                                <input type="submit" value="Edit" onClick={() => toggleEdit(index)} className="edit-card-input" />
                                <input type="submit" value="Delete" onClick={() => deleteCard(index)} className="delete-card-input" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            </>
        )}
        </>
    )

}

export default ManageDeck;