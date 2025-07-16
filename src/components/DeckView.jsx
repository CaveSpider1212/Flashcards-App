import Flashcard from "./Flashcard"
import { useNavigate } from "react-router-dom";
import "../css/DeckView.css"

function DeckView ({currentDeck, deckName, deckNumber}) {
    const navigate = useNavigate();

    const deleteDeck = () => {
        localStorage.removeItem(`deck${deckNumber}`);
        localStorage.removeItem(`deck${deckNumber}name`);

        window.location.reload(); // refreshes the page after removing deck (to make sure it was actually removed on the screen)
    }

    const handleEdit = () => {
        navigate(`/manage/${deckNumber}`);
    }

    return (
        <div className="deck-view">
            <Flashcard term={currentDeck[0].term} definition={currentDeck[0].definition} cardType="card overview" />

            <div className="right-side">
                <h1 className="deck-header">{deckName}</h1>

                <div className="deck-buttons">
                    <input type="submit" value="Edit" onClick={handleEdit} />
                    <input type="submit" value="Study" />
                    <input type="submit" value="Delete" onClick={deleteDeck} />
                </div>
            </div>
        </div>
    )
}

export default DeckView;