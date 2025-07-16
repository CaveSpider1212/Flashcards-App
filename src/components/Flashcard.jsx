import "../css/Flashcard.css"
import { useState } from "react";

function Flashcard ({term, definition, cardType}) {
    const [flipped, setFlipped] = useState(false);

    return (
        <div onClick={() => setFlipped(!flipped)} className={cardType}>
            {flipped ? definition : term}
        </div>
    )
}

export default Flashcard