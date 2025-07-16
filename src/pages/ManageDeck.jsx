import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Flashcard from "../components/Flashcard"

function ManageDeck () {
    const {deckId} = useParams();
    
    const [cards, setCards] = useState([]);

    const [term, setTerm] = useState('');
    const [definition, setDefinition] = useState('');

    const [name, setName] = useState('');

    const [editTerm, setEditTerm] = useState('');
    const [editDef, setEditDef] = useState('');

    const [editing, setEditing] = useState(false);

    const navigate = useNavigate();

    if (localStorage.getItem("maxDeckNum") == null) {
        var maxDeckNum = 0;
    }
    else {
        var maxDeckNum = localStorage.getItem("maxDeckNum");
    }

    useEffect(() => {
        if (deckId != 0) { // if the deckId (number read from URL) is not 0 (i.e. user is editing an existing deck), then get the corresponding deck and name from the localStorage
            const loadedDecks = JSON.parse(localStorage.getItem(`deck${deckId}`));
            const loadedName = localStorage.getItem(`deck${deckId}name`);

            setCards(loadedDecks);
            setName(loadedName);
        }
    }, [deckId]); // runs every time deckId changes

    const addCard = () => {
        const newCard = {term, definition, editing};
        setCards((prevCards) => [...prevCards, newCard])

        setTerm('');
        setDefinition('');
    }

    const createDeck = () => {
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

    const editCard = (editIndex) => {
        const updatedCards = [...cards];
        updatedCards[editIndex].term = editTerm;
        updatedCards[editIndex].definition = editDef;

        setEditTerm('');
        setEditDef('');
        setCards(updatedCards);

        toggleEdit(editIndex);
    }

    const deleteCard = (deleteIndex) => {
        const updatedCards = [];

        cards.map((card, index) => {
            if (index != deleteIndex) {
                updatedCards.push(card);
            }
        })

        console.log(updatedCards);
        setCards(updatedCards);
    }

    return (
        <>
            <div>
                <input type="text" placeholder="Deck name" value={name} onChange={(e) => setName(e.target.value)} required="required"/>
            </div>

            <div>
                <input type="text" placeholder="Term" value={term} onChange={(e) => setTerm(e.target.value)} required="required" />
                <input type="text" placeholder="Definition" value = {definition} onChange={(e) => setDefinition(e.target.value)} required = "required" />
                <input type="submit" value="Add Term" onClick={addCard}/>
            </div>
            
            <div>
                <input type="submit" value="Save Deck" onClick={createDeck} />
            </div>

            <p><i>Click on a card to flip it!</i></p>

            <div>
                {cards.map((card, index) => (
                    <div key={index}>
                        {/* shows either the text box for editing or the flashcard with the term and definition, depending on the value of card.editing */}

                        {card.editing ? (
                            <div>
                                <input type="text" value={editTerm} onChange={(e) => setEditTerm(e.target.value)} />
                                <input type="text" value={editDef} onChange={(e) => setEditDef(e.target.value)} />
                                <input type="submit" value="Save card" onClick={() => editCard(index)} />
                            </div>
                        ) : (
                            <div>
                                <Flashcard term={card.term} definition={card.definition} cardType="card createdeck" />

                                <input type="submit" value="Edit" onClick={() => toggleEdit(index)} />
                                <input type="submit" value="Delete" onClick={() => deleteCard(index)} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}

export default ManageDeck