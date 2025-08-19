import { useState, useEffect, use } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Flashcard from "../components/Flashcard"
import { currentUser, createDeck, createCard, getDeckById, getCards, updateCard, updateDeck, deleteCard } from "../api";
import "../css/ManageDeck.css";

/**
 * Function for the "Manage Deck" page
 */

function ManageDeck () {

    /**
     * State variables
     */
    const [cards, setCards] = useState([]); // represents the array of cards that are part of the deck being created/edited
    // const [existingCards, setExistingCards] = useState([]); // represents the array of cards that were already in the deck before being modified, set to an empty array [] by default (only for updating)
    const [deck, setDeck] = useState([]); // represents the deck the user is editing, set to an empty array [] by default
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
     * Reads the token from the local storage
     * If found, sets the user state variable to the user asssociated with the token using currentUser() function
     */
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            currentUser(token).then((data) => setUser(data));
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
        if (deckId != 0) { // if the deckId (number read from URL) is not 0 (i.e. user is editing an existing deck), then get the corresponding deck from the database
            getDeckById(deckId).then((data) => setDeck(data));
            getCards(deckId).then((data) => setCards(data));
        }
    }, [deckId]);


    /**
     * Sets the name state variable to the deck state array's name
     * Runs each time deck changes, indicated by [deck]
     */
    useEffect(() => {
        setName(deck.name);
    }, [deck])


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
     * Gets the user token from the local storage
     * If user is creating a new deck, then create the deck first and then create each card after that, adding it to the deck
     * If user is editing an existing deck, then find the new, deleted, and updated cards, and either create a card (and add to deck),
     *      delete a card, or update a card
     * Navigates to the Decks page when successful
     */
    const saveDeck = async () => {
        const token = localStorage.getItem("token");

        if (deckId == 0) { // if the user is creating a new deck (not editing an existing one), then create a new deck and cards
            const createdDeck = await createDeck(name, token);

            // for each card in the cards state array, create a new card in the database using the term, definition, deck ID, and token
            cards.forEach((card) => {
                createCard(card.term, card.definition, createdDeck._id, token);
            });
        }
        else { // if the user is editing an existing deck, then update the deck and cards
            const updatedDeck = await updateDeck(name, deck._id, token); // updates the deck name
            const existingCards = await getCards(deck._id) // gets the array of cards already in the deck before being modified

            // if a card is in cards but not existingCards, then it is a new card (needs to be created in the database)
            const newCards = cards.filter((card) => 
                !existingCards.some((existingCard) => existingCard._id === card._id)
            );
            
            // if a card is in existingCards but not in cards, then that card was deleted (needs to be deleted from database)
            const deletedCards = existingCards.filter((existingCard) => 
                !cards.some((card) => existingCard._id === card._id)
            );

            // if a card is both in existingCards and cards, then it was either updated or unchanged (update these cards in the database)
            const updatedCards = cards.filter((card) => 
                existingCards.some((existingCard) => existingCard._id === card._id)
            );

            // for each new card, create a new flashcard in the database using its term, definition, deck ID, and user token
            newCards.forEach((card) => {
                createCard(card.term, card.definition, updatedDeck._id, token);
            });

            // for each deleted card, delete the corresponding flashcard from the database using the card's ID and user token
            deletedCards.forEach((card) => {
                deleteCard(card._id, token);
            });

            // for each card updated or unchanged, update it in the database
            updatedCards.forEach((card) => {
                updateCard(card.term, card.definition, card._id, token);
            })
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
    const editFlashcard = (editIndex) => {
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
    const deleteFlashcard = (deleteIndex) => {
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

                <div className="card-inputs">
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
                                <input type="submit" value="Save card" onClick={() => editFlashcard(index)} className="save-card-input" />
                            </div>
                        ) : (
                            <div>
                                <Flashcard term={card.term} definition={card.definition} cardType="card createdeck" />

                                <input type="submit" value="Edit" onClick={() => toggleEdit(index)} className="edit-card-input" />
                                <input type="submit" value="Delete" onClick={() => deleteFlashcard(index)} className="delete-card-input" />
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